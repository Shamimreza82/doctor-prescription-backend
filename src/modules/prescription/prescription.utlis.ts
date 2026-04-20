import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import { AppError } from "@/shared/errors/AppError";

import { PRESCRIPTION_MESSAGES } from "./prescription.constants";
import { PrescriptionRepository } from "./prescription.repository";
import { TPrescriptionActor, TPrescriptionItemInput, TPrescriptionListQuery, TPrescriptionScope } from "./prescription.types";

const resolveTenantScope = (
  actor: TPrescriptionActor,
  requestedTenantId?: string,
): TPrescriptionScope => {
  const isSuperAdmin = actor.role === 'SUPER_ADMIN';

  if (isSuperAdmin) {
    return {
      tenantId: requestedTenantId,
      isSuperAdmin: true,
    };
  }

  if (!actor.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PRESCRIPTION_MESSAGES.TENANT_REQUIRED);
  }

  return {
    tenantId: actor.tenantId,
    isSuperAdmin: false,
  };
};

const buildTenantWhere = (scope: TPrescriptionScope): Prisma.PrescriptionWhereInput => {
  if (scope.isSuperAdmin && !scope.tenantId) {
    return {};
  }

  if (!scope.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PRESCRIPTION_MESSAGES.TENANT_REQUIRED);
  }

  return {
    tenantId: scope.tenantId,
  };
};

const buildPrescriptionNumber = () => `RX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const mapItems = (items: TPrescriptionItemInput[] = []) =>
  items.map((item, index): Prisma.PrescriptionItemCreateWithoutPrescriptionInput => ({
    medicineName: item.medicineName,
    genericName: item.genericName ?? null,
    dosage: item.dosage ?? null,
    frequency: item.frequency ?? null,
    durationValue: item.durationValue ?? null,
    durationUnit: item.durationUnit ?? null,
    route: item.route ?? null,
    instruction: item.instruction ?? null,
    quantity: item.quantity ?? null,
    timing: item.timing ?? null,
    sortOrder: item.sortOrder ?? index,
    metadata: item.metadata,
  }));

  

const getPatientOrThrow = async (patientId: string, scope: TPrescriptionScope) => {
  if (!scope.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PRESCRIPTION_MESSAGES.TENANT_REQUIRED);
  }

  const patient = await PrescriptionRepository.findPatientById(patientId, scope.tenantId);

  if (!patient) {
    throw new AppError(StatusCodes.NOT_FOUND, PRESCRIPTION_MESSAGES.PATIENT_NOT_FOUND);
  }

  return patient;
};

const getDoctorIdOrThrow = async (
  actor: TPrescriptionActor,
  scope: TPrescriptionScope,
  requestedDoctorId?: string,
) => {
  if (!scope.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PRESCRIPTION_MESSAGES.TENANT_REQUIRED);
  }
  console.log('Resolved tenant scope for doctor lookup:', actor);


  if (actor.role === 'DOCTOR') {
    const doctor = await PrescriptionRepository.findDoctorByUserId(actor.userId, scope.tenantId);

    console.log('Found doctor profile for user:', doctor);

    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, PRESCRIPTION_MESSAGES.DOCTOR_PROFILE_REQUIRED);
    }

    return doctor.id;
  }

  if (!requestedDoctorId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PRESCRIPTION_MESSAGES.DOCTOR_ID_REQUIRED);
  }

  const doctor = await PrescriptionRepository.findDoctorById(requestedDoctorId, scope.tenantId);

  if (!doctor) {
    throw new AppError(StatusCodes.NOT_FOUND, PRESCRIPTION_MESSAGES.DOCTOR_NOT_FOUND);
  }

  return doctor.id;
};

const validateVisitOrThrow = async (
  visitId: string,
  patientId: string,
) => {
  const visit = await PrescriptionRepository.findVisitById(visitId);

  if (visit?.patientId !== patientId) {
    throw new AppError(StatusCodes.NOT_FOUND, PRESCRIPTION_MESSAGES.VISIT_NOT_FOUND);
  }

  return visit;
};

const getScopedPrescriptionOrThrow = async (prescriptionId: string, scope: TPrescriptionScope) => {
  const prescription = await PrescriptionRepository.findFirstPrescription({
    id: prescriptionId,
    deletedAt: null,
    ...buildTenantWhere(scope),
  });

  if (!prescription) {
    throw new AppError(StatusCodes.NOT_FOUND, PRESCRIPTION_MESSAGES.NOT_FOUND);
  }

  return prescription;
};


const buildPrescriptionListWhere = (
  scope: TPrescriptionScope,
  query: TPrescriptionListQuery,
): Prisma.PrescriptionWhereInput => {
  const filters: Prisma.PrescriptionWhereInput = {
    deletedAt: null,
    ...buildTenantWhere(scope),
  };

  if (query.status) {
    filters.status = query.status;
  }

  if (query.patientId) {
    filters.patientId = query.patientId;
  }

  if (query.doctorId) {
    filters.doctorId = query.doctorId;
  }

  if (query.issuedFrom || query.issuedTo) {
    filters.issuedAt = {
      gte: query.issuedFrom,
      lte: query.issuedTo,
    };
  }

  const search = query.search?.trim();

  if (search) {
    filters.OR = [
      {
        prescriptionNumber: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        diagnosis: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        patient: {
          firstName: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      {
        patient: {
          lastName: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  return filters;
};

const buildOrderBy = (
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'desc',
): Prisma.PrescriptionOrderByWithRelationInput[] => {
  if (sortBy === 'issuedAt') {
    return [{ issuedAt: sortOrder }, { createdAt: sortOrder }];
  }

  if (sortBy === 'prescriptionNumber') {
    return [{ prescriptionNumber: sortOrder }];
  }

  return [{ createdAt: sortOrder }];
};





export const PrescriptionUtils = {
  resolveTenantScope,
  buildTenantWhere,
  buildPrescriptionNumber,
  mapItems,
  getPatientOrThrow,
  getDoctorIdOrThrow,
  validateVisitOrThrow,
  getScopedPrescriptionOrThrow,
  buildPrescriptionListWhere,
  buildOrderBy,
};

