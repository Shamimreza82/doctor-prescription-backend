import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';

const patientInclude = {
  addresses: true,
  emergencyContacts: true,
  medicalProfile: true,
  insurances: true,
  identifiers: true,
} satisfies Prisma.PatientInclude;

const createPatient = async (data: Prisma.PatientCreateInput) => {
  return prisma.patient.create({
    data,
    include: patientInclude,
  });
};

const findFirstPatient = async (where: Prisma.PatientWhereInput) => {
  return prisma.patient.findFirst({
    where,
    include: {
      ...patientInclude,
      prescriptions: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      visits: {
        take: 5,
        orderBy: { visitDate: 'desc' },
      },
    },
  });
};

const listPatients = async (
  where: Prisma.PatientWhereInput,
  orderBy: Prisma.PatientOrderByWithRelationInput[],
  skip: number,
  take: number,
) => {
  const [data, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        addresses: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    }),
    prisma.patient.count({ where }),
  ]);

  return { data, total };
};

const updatePatient = async (patientId: string, data: Prisma.PatientUpdateInput) => {
  return prisma.patient.update({
    where: { id: patientId },
    data,
    include: patientInclude,
  });
};

// Visit Repository Methods
const createVisit = async (data: Prisma.VisitCreateInput) => {
  return prisma.visit.create({
    data,
  });
};

const listVisits = async (
  where: Prisma.VisitWhereInput,
  orderBy: Prisma.VisitOrderByWithRelationInput[],
  skip: number,
  take: number,
) => {
  const [data, total] = await Promise.all([
    prisma.visit.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.visit.count({ where }),
  ]);

  return { data, total };
};

const findVisitById = async (visitId: string, patientId: string) => {
  return prisma.visit.findFirst({
    where: {
      id: visitId,
      patientId,
    },
  });
};

const updateVisit = async (visitId: string, data: Prisma.VisitUpdateInput) => {
  return prisma.visit.update({
    where: { id: visitId },
    data,
  });
};

export const PatientRepository = {
  createPatient,
  findFirstPatient,
  listPatients,
  updatePatient,
  createVisit,
  listVisits,
  findVisitById,
  updateVisit,
};
