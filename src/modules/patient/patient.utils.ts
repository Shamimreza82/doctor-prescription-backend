import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';

import { PATIENT_MESSAGES } from './patient.constants';
import { PatientRepository } from './patient.repository';
import { TPatientActor, TPatientListQuery, TPatientScope } from './patient.types';

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

export const PatientUtils = {
  resolveTenantScope,
  buildPatientCode,
  splitName,
  getDateOfBirthFromAge,
  buildTenantWhere,
  buildPatientListWhere,
  buildOrderBy,
  getScopedPatientOrThrow,
};
