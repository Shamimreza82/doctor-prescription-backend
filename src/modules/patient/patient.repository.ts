import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';

const patientInclude = {
  addresses: {
    where: {
      isPrimary: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 1,
  },
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
      addresses: true,
      prescriptions: true
    }
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
      include: patientInclude,
    }),
    prisma.patient.count({ where }),
  ]);

  return { data, total };
};

const updatePatient = async (
  patientId: string,
  data: Prisma.PatientUpdateInput,
  primaryAddress?: string | null,
) => {
  return prisma.$transaction(async (tx) => {
    await tx.patient.update({
      where: { id: patientId },
      data,
      include: patientInclude,
    });

    if (primaryAddress !== undefined) {
      await tx.patientAddress.deleteMany({
        where: {
          patientId,
          isPrimary: true,
        },
      });

      if (primaryAddress) {
        await tx.patientAddress.create({
          data: {
            patientId,
            type: 'HOME',
            addressLine: primaryAddress,
            isPrimary: true,
          },
        });
      }
    }

    return tx.patient.findUniqueOrThrow({
      where: { id: patientId },
      include: patientInclude,
    });
  });
};

export const PatientRepository = {
  createPatient,
  findFirstPatient,
  listPatients,
  updatePatient,
};
