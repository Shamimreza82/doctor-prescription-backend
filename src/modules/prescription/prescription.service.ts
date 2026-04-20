import { Prisma, PrescriptionStatus } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';
import { paginateResponse } from '@/shared/utils/paginateResponse';
import { calculatePagination } from '@/shared/utils/pagination';

import { PRESCRIPTION_MESSAGES } from './prescription.constants';
import { PrescriptionRepository } from './prescription.repository';
import { PrescriptionUtils } from './prescription.utlis';

import type {
  TPrescriptionActor,
  TPrescriptionCreateInput,
  TPrescriptionListQuery,
  TPrescriptionUpdateInput,
} from './prescription.types';






const createPrescription = async (actor: TPrescriptionActor, payload: TPrescriptionCreateInput) => {

  const scope = PrescriptionUtils.resolveTenantScope(actor, payload.tenantId);

  if (!scope.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PRESCRIPTION_MESSAGES.TENANT_REQUIRED);
  }

  console.log('Resolved tenant scope:', scope);

  

  await PrescriptionUtils.getPatientOrThrow(payload.patientId, scope);
  const doctorId = await PrescriptionUtils.getDoctorIdOrThrow(actor, scope, payload.doctorId);

  if (payload.visitId) {
    await PrescriptionUtils.validateVisitOrThrow(payload.visitId, payload.patientId);
  }

  return PrescriptionRepository.createPrescription(
    {
      tenant: {
        connect: {
          id: scope.tenantId,
        },
      },
      patient: {
        connect: {
          id: payload.patientId,
        },
      },
      doctor: {
        connect: {
          id: doctorId,
        },
      },
      ...(payload.visitId
        ? {
            visit: {
              connect: {
                id: payload.visitId,
              },
            },
          }
        : {}),
      prescriptionNumber: payload.prescriptionNumber ?? PrescriptionUtils.buildPrescriptionNumber(),
      status: payload.status ?? PrescriptionStatus.DRAFT,
      diagnosis: payload.diagnosis ?? null,
      symptoms: payload.symptoms ?? null,
      advice: payload.advice ?? null,
      notes: payload.notes ?? null,
      followUpDate: payload.followUpDate ?? null,
      issuedAt: payload.issuedAt ?? null,
      expiresAt: payload.expiresAt ?? null,
      metadata: payload.metadata,
    },
    PrescriptionUtils.mapItems(payload.items),
  );
};

const listPrescriptions = async (actor: TPrescriptionActor, query: TPrescriptionListQuery) => {
  const scope = PrescriptionUtils.resolveTenantScope(actor, query.tenantId);
  const { page, limit, skip } = calculatePagination(query);
  const where = PrescriptionUtils.buildPrescriptionListWhere(scope, query);
  const orderBy = PrescriptionUtils.buildOrderBy(query.sortBy, query.sortOrder);
  const { data, total } = await PrescriptionRepository.listPrescriptions(where, orderBy, skip, limit);

  return paginateResponse(data, total, page, limit);
};

const getPrescriptionById = async (actor: TPrescriptionActor, prescriptionId: string) => {
  const scope = PrescriptionUtils.resolveTenantScope(actor);
  return PrescriptionUtils.getScopedPrescriptionOrThrow(prescriptionId, scope);
};

const updatePrescription = async (
  actor: TPrescriptionActor,
  prescriptionId: string,
  payload: TPrescriptionUpdateInput,
) => {
  const current = await PrescriptionUtils.getScopedPrescriptionOrThrow(prescriptionId, PrescriptionUtils.resolveTenantScope(actor, payload.tenantId));
  const scope = PrescriptionUtils.resolveTenantScope(actor, current.tenantId);

  const nextPatientId = payload.patientId ?? current.patientId;
  await PrescriptionUtils.getPatientOrThrow(nextPatientId, scope);

  if (payload.visitId) {
    await PrescriptionUtils.validateVisitOrThrow(payload.visitId, nextPatientId);
  }

  const data: Prisma.PrescriptionUpdateInput = {};

  if (payload.patientId) {
    data.patient = {
      connect: {
        id: payload.patientId,
      },
    };
  }

  if (payload.doctorId !== undefined || actor.role === 'DOCTOR') {
    const doctorId = await PrescriptionUtils.getDoctorIdOrThrow(actor, scope, payload.doctorId);
    data.doctor = {
      connect: {
        id: doctorId,
      },
    };
  }

  if (payload.visitId !== undefined) {
    data.visit = payload.visitId
      ? {
          connect: {
            id: payload.visitId,
          },
        }
      : {
          disconnect: true,
        };
  }

  if (payload.prescriptionNumber !== undefined) {
    data.prescriptionNumber = payload.prescriptionNumber;
  }

  if (payload.status !== undefined) {
    data.status = payload.status;
  }

  if (payload.diagnosis !== undefined) {
    data.diagnosis = payload.diagnosis;
  }

  if (payload.symptoms !== undefined) {
    data.symptoms = payload.symptoms;
  }

  if (payload.advice !== undefined) {
    data.advice = payload.advice;
  }

  if (payload.notes !== undefined) {
    data.notes = payload.notes;
  }

  if (payload.followUpDate !== undefined) {
    data.followUpDate = payload.followUpDate;
  }

  if (payload.issuedAt !== undefined) {
    data.issuedAt = payload.issuedAt;
  }

  if (payload.expiresAt !== undefined) {
    data.expiresAt = payload.expiresAt;
  }

  if (payload.metadata !== undefined) {
    data.metadata = payload.metadata === null ? Prisma.JsonNull : payload.metadata;
  }

  return PrescriptionRepository.updatePrescription(
    prescriptionId,
    data,
    payload.items ? PrescriptionUtils.mapItems(payload.items) : undefined,
  );
};

const archivePrescription = async (actor: TPrescriptionActor, prescriptionId: string) => {
  const scope = PrescriptionUtils.resolveTenantScope(actor);
  await PrescriptionUtils.getScopedPrescriptionOrThrow(prescriptionId, scope);

  return PrescriptionRepository.updatePrescription(prescriptionId, {
    deletedAt: new Date(),
    status: PrescriptionStatus.CANCELLED,
  });
};

export const PrescriptionServices = {
  createPrescription,
  listPrescriptions,
  getPrescriptionById,
  updatePrescription,
  archivePrescription,
};
