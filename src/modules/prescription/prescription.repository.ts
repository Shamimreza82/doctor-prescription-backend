import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';

const prescriptionInclude = {
  patient: {
    select: {
      id: true,
      patientCode: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  },
  doctor: {
    select: {
      id: true,
      registrationNumber: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
  visit: {
    select: {
      id: true,
      visitNumber: true,
      visitDate: true,
      status: true,
    },
  },
  items: {
    orderBy: {
      sortOrder: 'asc',
    },
  },
} satisfies Prisma.PrescriptionInclude;


const findFirstPrescription = async (where: Prisma.PrescriptionWhereInput) => {
  return prisma.prescription.findFirst({
    where,
    include: prescriptionInclude,
  });
};

const listPrescriptions = async (
  where: Prisma.PrescriptionWhereInput,
  orderBy: Prisma.PrescriptionOrderByWithRelationInput[],
  skip: number,
  take: number,
) => {
  const [data, total] = await Promise.all([
    prisma.prescription.findMany({
      where,
      orderBy,
      skip,
      take,
      include: prescriptionInclude,
    }),
    prisma.prescription.count({ where }),
  ]);

  return { data, total };
};

const createPrescription = async (
  data: Prisma.PrescriptionCreateInput,
  items: Prisma.PrescriptionItemCreateWithoutPrescriptionInput[],
) => {
  return prisma.prescription.create({
    data: {
      ...data,
      items: items.length ? { create: items } : undefined,
    },
    include: prescriptionInclude,
  });
};

const updatePrescription = async (
  prescriptionId: string,
  data: Prisma.PrescriptionUpdateInput,
  items?: Prisma.PrescriptionItemCreateWithoutPrescriptionInput[],
) => {
  return prisma.$transaction(async (tx) => {
    await tx.prescription.update({
      where: { id: prescriptionId },
      data,
    });

    if (items) {
      await tx.prescriptionItem.deleteMany({
        where: {
          prescriptionId,
        },
      });

      if (items.length) {
        await tx.prescriptionItem.createMany({
          data: items.map((item) => ({
            prescriptionId,
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
            sortOrder: item.sortOrder ?? 0,
            metadata: item.metadata ?? Prisma.JsonNull,
          })),
        });
      }
    }

    return tx.prescription.findUniqueOrThrow({
      where: { id: prescriptionId },
      include: prescriptionInclude,
    });
  });
};

const findPatientById = async (patientId: string, tenantId?: string) => {
  return prisma.patient.findFirst({
    where: {
      id: patientId,
      tenantId,
      deletedAt: null,
    },
  });
};

const findDoctorById = async (doctorId: string, tenantId?: string) => {
  return prisma.doctor.findFirst({
    where: {
      id: doctorId,
      tenantId,
    },
  });
};

const findDoctorByUserId = async (userId: string, tenantId?: string) => {
  return prisma.doctor.findFirst({
    where: {
      userId,
      tenantId,
    },
  });
};

const findVisitById = async (visitId: string) => {
  return prisma.visit.findFirst({
    where: {
      id: visitId,
      deletedAt: null,
    },
  });
};


export const PrescriptionRepository = {
  prescriptionInclude,
  findFirstPrescription,
  listPrescriptions,
  createPrescription,
  updatePrescription,
  findPatientById,
  findDoctorById,
  findDoctorByUserId,
  findVisitById,
};
