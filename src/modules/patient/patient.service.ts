import { Prisma, PatientStatus } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { prisma } from '@/bootstrap/prisma';
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
  TPatientMedicalProfileInput,
  TVisitCreateInput,
  TVisitListQuery,
  TVisitUpdateInput,
  TVisitVitalsInput,
} from './patient.types';

const createPatient = async (actor: TPatientActor, payload: TPatientCreateInput) => {
  const scope = PatientUtils.resolveTenantScope(actor);

  if (!scope.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, PATIENT_MESSAGES.TENANT_REQUIRED);
  }

  const { firstName, lastName } = PatientUtils.splitName(payload.name);
  const dateOfBirth =
    payload.dateOfBirth ??
    (typeof payload.age === 'number' ? PatientUtils.getDateOfBirthFromAge(payload.age) : undefined);

  const data: Prisma.PatientCreateInput = {
    tenant: { connect: { id: scope.tenantId } },
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
  };

  if (actor.role !== 'SUPER_ADMIN') {
    data.user = { connect: { id: actor.userId } };
  }

  if (payload.addresses?.length) {
    data.addresses = {
      createMany: {
        data: payload.addresses.map((addr) => ({
          type: addr.type ?? 'HOME',
          addressLine: addr.addressLine,
          area: addr.area,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postalCode,
          country: addr.country,
          isPrimary: addr.isPrimary ?? false,
        })),
      },
    };
  }

  if (payload.emergencyContacts?.length) {
    data.emergencyContacts = {
      createMany: {
        data: payload.emergencyContacts.map((contact) => ({
          name: contact.name,
          relation: contact.relation,
          phone: contact.phone,
          email: contact.email,
          address: contact.address,
          isPrimary: contact.isPrimary ?? false,
        })),
      },
    };
  }

  if (payload.medicalProfile) {
    data.medicalProfile = {
      create: {
        allergies: payload.medicalProfile.allergies,
        chronicDiseases: payload.medicalProfile.chronicDiseases,
        currentMedications: payload.medicalProfile.currentMedications,
        pastMedicalHistory: payload.medicalProfile.pastMedicalHistory,
        familyHistory: payload.medicalProfile.familyHistory,
        surgicalHistory: payload.medicalProfile.surgicalHistory,
        habits: payload.medicalProfile.habits,
        heightCm: payload.medicalProfile.heightCm,
        weightKg: payload.medicalProfile.weightKg,
      },
    };
  }

  if (payload.insurances?.length) {
    data.insurances = {
      createMany: {
        data: payload.insurances.map((ins) => ({
          providerName: ins.providerName,
          policyNumber: ins.policyNumber,
          memberId: ins.memberId,
          coverageDetails: ins.coverageDetails,
          validFrom: ins.validFrom,
          validTo: ins.validTo,
          isActive: ins.isActive ?? true,
        })),
      },
    };
  }

  if (payload.identifiers?.length) {
    data.identifiers = {
      createMany: {
        data: payload.identifiers.map((ident) => ({
          type: ident.type,
          value: ident.value,
          isPrimary: ident.isPrimary ?? false,
        })),
      },
    };
  }

  return PatientRepository.createPatient(data);
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

  if (payload.phone !== undefined) data.phone = payload.phone;
  if (payload.email !== undefined) data.email = payload.email;
  if (payload.gender !== undefined) data.gender = payload.gender;
  if (payload.bloodGroup !== undefined) data.bloodGroup = payload.bloodGroup;
  if (payload.maritalStatus !== undefined) data.maritalStatus = payload.maritalStatus;
  if (payload.occupation !== undefined) data.occupation = payload.occupation;
  if (payload.photoUrl !== undefined) data.photoUrl = payload.photoUrl;
  if (payload.status !== undefined) data.status = payload.status;
  if (payload.isActive !== undefined) data.isActive = payload.isActive;
  if (payload.notes !== undefined) data.notes = payload.notes;

  if (payload.dateOfBirth !== undefined || payload.age !== undefined) {
    data.dateOfBirth =
      payload.dateOfBirth ??
      (typeof payload.age === 'number' ? PatientUtils.getDateOfBirthFromAge(payload.age) : null);
  }

  if (payload.medicalProfile) {
    data.medicalProfile = {
      upsert: {
        create: {
          allergies: payload.medicalProfile.allergies,
          chronicDiseases: payload.medicalProfile.chronicDiseases,
          currentMedications: payload.medicalProfile.currentMedications,
          pastMedicalHistory: payload.medicalProfile.pastMedicalHistory,
          familyHistory: payload.medicalProfile.familyHistory,
          surgicalHistory: payload.medicalProfile.surgicalHistory,
          habits: payload.medicalProfile.habits,
          heightCm: payload.medicalProfile.heightCm,
          weightKg: payload.medicalProfile.weightKg,
        },
        update: {
          allergies: payload.medicalProfile.allergies,
          chronicDiseases: payload.medicalProfile.chronicDiseases,
          currentMedications: payload.medicalProfile.currentMedications,
          pastMedicalHistory: payload.medicalProfile.pastMedicalHistory,
          familyHistory: payload.medicalProfile.familyHistory,
          surgicalHistory: payload.medicalProfile.surgicalHistory,
          habits: payload.medicalProfile.habits,
          heightCm: payload.medicalProfile.heightCm,
          weightKg: payload.medicalProfile.weightKg,
        },
      },
    };
  }

  if (payload.addresses) {
    data.addresses = {
      deleteMany: {},
      create: payload.addresses.map((addr) => ({
        type: addr.type ?? 'HOME',
        addressLine: addr.addressLine,
        area: addr.area,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
        isPrimary: addr.isPrimary ?? false,
      })),
    };
  }

  if (payload.emergencyContacts) {
    data.emergencyContacts = {
      deleteMany: {},
      create: payload.emergencyContacts.map((contact) => ({
        name: contact.name,
        relation: contact.relation,
        phone: contact.phone,
        email: contact.email,
        address: contact.address,
        isPrimary: contact.isPrimary ?? false,
      })),
    };
  }

  if (payload.insurances) {
    data.insurances = {
      deleteMany: {},
      create: payload.insurances.map((ins) => ({
        providerName: ins.providerName,
        policyNumber: ins.policyNumber,
        memberId: ins.memberId,
        coverageDetails: ins.coverageDetails,
        validFrom: ins.validFrom,
        validTo: ins.validTo,
        isActive: ins.isActive ?? true,
      })),
    };
  }

  if (payload.identifiers) {
    data.identifiers = {
      deleteMany: {},
      create: payload.identifiers.map((ident) => ({
        type: ident.type,
        value: ident.value,
        isPrimary: ident.isPrimary ?? false,
      })),
    };
  }

  return PatientRepository.updatePatient(patientId, data);
};

const archivePatient = async (actor: TPatientActor, patientId: string) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  await PatientUtils.getScopedPatientOrThrow(patientId, scope);

  return PatientRepository.updatePatient(patientId, {
    deletedAt: new Date(),
    isActive: false,
    status: PatientStatus.INACTIVE,
  });
};

const getMedicalProfile = async (actor: TPatientActor, patientId: string) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  const patient = await PatientUtils.getScopedPatientOrThrow(patientId, scope);

  if (!patient.medicalProfile) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Medical profile not found');
  }

  return patient.medicalProfile;
};

const updateMedicalProfile = async (
  actor: TPatientActor,
  patientId: string,
  payload: TPatientMedicalProfileInput,
) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  await PatientUtils.getScopedPatientOrThrow(patientId, scope);

  return PatientRepository.updatePatient(patientId, {
    medicalProfile: {
      upsert: {
        create: {
          allergies: payload.allergies,
          chronicDiseases: payload.chronicDiseases,
          currentMedications: payload.currentMedications,
          pastMedicalHistory: payload.pastMedicalHistory,
          familyHistory: payload.familyHistory,
          surgicalHistory: payload.surgicalHistory,
          habits: payload.habits,
          heightCm: payload.heightCm,
          weightKg: payload.weightKg,
        },
        update: {
          allergies: payload.allergies,
          chronicDiseases: payload.chronicDiseases,
          currentMedications: payload.currentMedications,
          pastMedicalHistory: payload.pastMedicalHistory,
          familyHistory: payload.familyHistory,
          surgicalHistory: payload.surgicalHistory,
          habits: payload.habits,
          heightCm: payload.heightCm,
          weightKg: payload.weightKg,
        },
      },
    },
  });
};

// Visit Service Methods
const createVisit = async (actor: TPatientActor, patientId: string, payload: TVisitCreateInput) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  await PatientUtils.getScopedPatientOrThrow(patientId, scope);

  const visitNumber = `VISIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const data: Prisma.VisitCreateInput = {
    patient: { connect: { id: patientId } },
    doctor: { connect: { id: actor.userId } },
    visitNumber,
    visitDate: payload.visitDate,
    type: payload.type ?? 'OPD',
    status: payload.status ?? 'SCHEDULED',
    priority: payload.priority ?? 'NORMAL',
    source: payload.source ?? 'DIRECT',
    chiefComplaint: payload.chiefComplaint,
    reason: payload.reason,
    symptoms: payload.symptoms,
    diagnosis: payload.diagnosis,
    notes: payload.notes,
    queueNumber: payload.queueNumber,
    roomNumber: payload.roomNumber,
    departmentId: payload.departmentId,
    consultationFee: payload.consultationFee,
    discount: payload.discount,
    totalAmount: payload.consultationFee ? payload.consultationFee - (payload.discount ?? 0) : 0,
    followUpDate: payload.followUpDate,
    referredToDoctorId: payload.referredToDoctorId,
    metadata: payload.metadata as Prisma.InputJsonValue,
    createdById: actor.userId,
  };

  return PatientRepository.createVisit(data);
};

const listVisits = async (actor: TPatientActor, patientId: string, query: TVisitListQuery) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  await PatientUtils.getScopedPatientOrThrow(patientId, scope);

  const { page, limit, skip } = calculatePagination(query);

  const where: Prisma.VisitWhereInput = {
    patientId,
    deletedAt: null,
  };

  if (query.status) where.status = query.status;
  if (query.type) where.type = query.type;
  if (query.priority) where.priority = query.priority;

  if (query.startDate || query.endDate) {
    where.visitDate = {
      ...(query.startDate ? { gte: query.startDate } : {}),
      ...(query.endDate ? { lte: query.endDate } : {}),
    };
  }

  const { data, total } = await PatientRepository.listVisits(
    where,
    [{ visitDate: 'desc' }],
    skip,
    limit,
  );

  return paginateResponse(data, total, page, limit);
};

const getVisitById = async (actor: TPatientActor, patientId: string, visitId: string) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  await PatientUtils.getScopedPatientOrThrow(patientId, scope);

  const visit = await PatientRepository.findVisitById(visitId, patientId);

  if (!visit) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Visit not found');
  }

  return visit;
};

const updateVisit = async (
  actor: TPatientActor,
  patientId: string,
  visitId: string,
  payload: TVisitUpdateInput,
) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  await PatientUtils.getScopedPatientOrThrow(patientId, scope);

  const visit = await PatientRepository.findVisitById(visitId, patientId);
  if (!visit) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Visit not found');
  }

  const data: Prisma.VisitUpdateInput = {
    ...payload,
    metadata: payload.metadata as Prisma.InputJsonValue,
    updatedById: actor.userId,
  };

  if (payload.consultationFee !== undefined || payload.discount !== undefined) {
    const fee = payload.consultationFee ?? Number(visit.consultationFee ?? 0);
    const discount = payload.discount ?? Number(visit.discount ?? 0);
    data.totalAmount = fee - discount;
  }

  return PatientRepository.updateVisit(visitId, data);
};

const getVisitVitals = async (actor: TPatientActor, patientId: string, visitId: string) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  await PatientUtils.getScopedPatientOrThrow(patientId, scope);

  const visit = await prisma.visit.findFirst({
    where: { id: visitId, patientId },
    include: { vitals: true },
  });

  if (!visit || !visit.vitals) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Vitals not found');
  }

  return visit.vitals;
};

const recordVisitVitals = async (
  actor: TPatientActor,
  patientId: string,
  visitId: string,
  payload: TVisitVitalsInput,
) => {
  const scope = PatientUtils.resolveTenantScope(actor);
  await PatientUtils.getScopedPatientOrThrow(patientId, scope);

  const visit = await PatientRepository.findVisitById(visitId, patientId);
  if (!visit) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Visit not found');
  }

  return prisma.visitVitals.upsert({
    where: { visitId },
    create: {
      visit: { connect: { id: visitId } },
      ...payload,
    },
    update: payload,
  });
};

export const PatientServices = {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  archivePatient,
  getMedicalProfile,
  updateMedicalProfile,
  createVisit,
  listVisits,
  getVisitById,
  updateVisit,
  getVisitVitals,
  recordVisitVitals,
};
