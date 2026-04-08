import { Prisma, PatientStatus } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';
import { paginateResponse } from '@/shared/utils/paginateResponse';
import { calculatePagination } from '@/shared/utils/pagination';

import { PATIENT_MESSAGES } from './patient.constants';
import { PatientRepository } from './patient.repository';

import type {
  TPatientActor,
  TPatientCreateInput,
  TPatientListQuery,
  TPatientScope,
  TPatientUpdateInput,
} from './patient.types';



const resolveTenantScope = (
  actor: TPatientActor,
  requestedTenantId?: string,
): { tenantId?: string; isSuperAdmin: boolean } => {
  const isSuperAdmin = actor.role === 'SUPER_ADMIN';

  if (isSuperAdmin) {
    return {
      tenantId: requestedTenantId,
      isSuperAdmin: true,
    };
  }

  if (!actor.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PATIENT_MESSAGES.TENANT_REQUIRED);
  }

  return {
    tenantId: actor.tenantId,
    isSuperAdmin: false,
  };
};

const buildPatientCode = () => `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const [firstName = '', ...rest] = parts;

  return {
    firstName,
    lastName: rest.length ? rest.join(' ') : null,
  };
};

const getDateOfBirthFromAge = (age: number) => {
  const now = new Date();
  return new Date(now.getFullYear() - age, now.getMonth(), now.getDate());
};

const buildTenantWhere = (scope: TPatientScope): Prisma.PatientWhereInput => {
  if (scope.isSuperAdmin && !scope.tenantId) {
    return {};
  }

  if (!scope.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PATIENT_MESSAGES.TENANT_REQUIRED);
  }

  return {
    tenantId: scope.tenantId,
  };
};

const buildPatientListWhere = (
  scope: TPatientScope,
  query: TPatientListQuery,
): Prisma.PatientWhereInput => {
  const tenantWhere = buildTenantWhere(scope);
  const search = query.search?.trim();

  const filters: Prisma.PatientWhereInput = {
    deletedAt: null,
    ...tenantWhere,
  };

  if (query.status) {
    filters.status = query.status;
  }

  if (query.gender) {
    filters.gender = query.gender;
  }

  if (typeof query.isActive === 'boolean') {
    filters.isActive = query.isActive;
  }

  if (search) {
    filters.OR = [
      {
        firstName: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        lastName: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        phone: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  return filters;
};

const buildOrderBy = (sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') => {
  if (sortBy === 'name') {
    return [
      { firstName: sortOrder },
      { lastName: sortOrder },
    ] satisfies Prisma.PatientOrderByWithRelationInput[];
  }

  return [{ createdAt: sortOrder }] satisfies Prisma.PatientOrderByWithRelationInput[];
};

const getScopedPatientOrThrow = async (patientId: string, scope: TPatientScope) => {
  const patient = await PatientRepository.findFirstPatient({
    id: patientId,
    deletedAt: null,
    ...buildTenantWhere(scope),
  });

  if (!patient) {
    throw new AppError(StatusCodes.NOT_FOUND, PATIENT_MESSAGES.NOT_FOUND);
  }

  return patient;
};









const createPatient = async (actor: TPatientActor, payload: TPatientCreateInput) => {
  const scope = resolveTenantScope(actor, payload.tenantId);

  if (!scope.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PATIENT_MESSAGES.TENANT_REQUIRED);
  }

  const { firstName, lastName } = splitName(payload.name);
  const dateOfBirth =
    payload.dateOfBirth ?? (typeof payload.age === 'number' ? getDateOfBirthFromAge(payload.age) : undefined);

  return PatientRepository.createPatient({
    tenant: {
      connect: {
        id: scope.tenantId,
      },
    },
    patientCode: buildPatientCode(),
    firstName,
    lastName,
    phone: payload.phone,
    email: payload.email,
    gender: payload.gender,
    dateOfBirth,
    bloodGroup: payload.bloodGroup,
    maritalStatus: payload.maritalStatus,
    occupation: payload.occupation,
    photoUrl: payload.photoUrl,
    status: payload.status ?? PatientStatus.ACTIVE,
    isActive: payload.isActive ?? true,
    notes: payload.notes,
    ...(payload.address
      ? {
          addresses: {
            create: {
              type: 'HOME',
              addressLine: payload.address,
              isPrimary: true,
            },
          },
        }
      : {}),
  });
};

const listPatients = async (actor: TPatientActor, query: TPatientListQuery) => {
  const scope = resolveTenantScope(actor);
  const { page, limit, skip } = calculatePagination(query);
  const where = buildPatientListWhere(scope, query);
  const orderBy = buildOrderBy(query.sortBy, query.sortOrder);

  const { data, total } = await PatientRepository.listPatients(where, orderBy, skip, limit);

  return paginateResponse(data, total, page, limit);
};




const getPatientById = async (actor: TPatientActor, patientId: string) => {
  const scope = resolveTenantScope(actor);
  return getScopedPatientOrThrow(patientId, scope);
};

const updatePatient = async (
  actor: TPatientActor,
  patientId: string,
  payload: TPatientUpdateInput,
) => {
  const scope = resolveTenantScope(actor);
  await getScopedPatientOrThrow(patientId, scope);

  const data: Prisma.PatientUpdateInput = {};

  if (payload.name) {
    const { firstName, lastName } = splitName(payload.name);
    data.firstName = firstName;
    data.lastName = lastName;
  }

  if (payload.phone !== undefined) {
    data.phone = payload.phone;
  }

  if (payload.email !== undefined) {
    data.email = payload.email;
  }

  if (payload.gender !== undefined) {
    data.gender = payload.gender;
  }

  if (payload.bloodGroup !== undefined) {
    data.bloodGroup = payload.bloodGroup;
  }

  if (payload.maritalStatus !== undefined) {
    data.maritalStatus = payload.maritalStatus;
  }

  if (payload.occupation !== undefined) {
    data.occupation = payload.occupation;
  }

  if (payload.photoUrl !== undefined) {
    data.photoUrl = payload.photoUrl;
  }

  if (payload.status !== undefined) {
    data.status = payload.status;
  }

  if (payload.isActive !== undefined) {
    data.isActive = payload.isActive;
  }

  if (payload.notes !== undefined) {
    data.notes = payload.notes;
  }

  if (payload.dateOfBirth !== undefined || payload.age !== undefined) {
    data.dateOfBirth =
      payload.dateOfBirth ?? (typeof payload.age === 'number' ? getDateOfBirthFromAge(payload.age) : null);
  }

  return PatientRepository.updatePatient(patientId, data, payload.address);
};

const archivePatient = async (actor: TPatientActor, patientId: string) => {
  const scope = resolveTenantScope(actor);
  await getScopedPatientOrThrow(patientId, scope);

  return PatientRepository.updatePatient(
    patientId,
    {
      deletedAt: new Date(),
      isActive: false,
      status: PatientStatus.INACTIVE,
    },
    undefined,
  );
};

export const PatientServices = {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  archivePatient,
};
