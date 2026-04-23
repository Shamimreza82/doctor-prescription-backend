import { Prisma, PatientStatus } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';
import { paginateResponse } from '@/shared/utils/paginateResponse';
import { calculatePagination } from '@/shared/utils/pagination';

import { PATIENT_MESSAGES } from './patient.constants';
import { PatientRepository } from './patient.repository';
import { PatientUtils } from './patient.utils';

import type {
  TPatientActor,
  TPatientCreateInput,
  TPatientListQuery,
  TPatientUpdateInput,
} from './patient.types';










const createPatient = async (actor: TPatientActor, payload: TPatientCreateInput) => {
  const scope = PatientUtils.resolveTenantScope(actor);

  if (!scope.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PATIENT_MESSAGES.TENANT_REQUIRED);
  }

  const { firstName, lastName } = PatientUtils.splitName(payload.name);
  const dateOfBirth =
    payload.dateOfBirth ?? (typeof payload.age === 'number' ? PatientUtils.getDateOfBirthFromAge(payload.age) : undefined);

  return PatientRepository.createPatient({
    tenant: {
      connect: {
        id: scope.tenantId,
      },
    },
    user: {
      connect: {
        id: actor.userId,
      },
    },
    patientCode: PatientUtils.buildPatientCode(),
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
  const scope = PatientUtils.resolveTenantScope(actor);
  const { page, limit, skip } = calculatePagination(query);
  const where = PatientUtils.buildPatientListWhere(scope, query);
  const orderBy = PatientUtils.buildOrderBy(query.sortBy, query.sortOrder);

  const { data, total } = await PatientRepository.listPatients(where, orderBy, skip, limit);

  return paginateResponse(data, total, page, limit);
};

const getPatientById = async (actor: TPatientActor, patientId: string) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  return PatientUtils.getScopedPatientOrThrow(patientId, scope);
};

const updatePatient = async (
  actor: TPatientActor,
  patientId: string,
  payload: TPatientUpdateInput,
) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  await PatientUtils.getScopedPatientOrThrow(patientId, scope);

  const data: Prisma.PatientUpdateInput = {};

  if (payload.name) {
    const { firstName, lastName } = PatientUtils.splitName(payload.name);
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
      payload.dateOfBirth ?? (typeof payload.age === 'number' ? PatientUtils.getDateOfBirthFromAge(payload.age) : null);
  }

  return PatientRepository.updatePatient(patientId, data, payload.address);
};

const archivePatient = async (actor: TPatientActor, patientId: string) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  await PatientUtils.getScopedPatientOrThrow(patientId, scope);

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
