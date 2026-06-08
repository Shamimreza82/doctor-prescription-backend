import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';

const fileInclude = {
  uploadedBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
} satisfies Prisma.FileInclude;

const createFile = async (data: Prisma.FileCreateInput) => {
  return prisma.file.create({
    data,
    include: fileInclude,
  });
};

const findFirstFile = async (where: Prisma.FileWhereInput) => {
  return prisma.file.findFirst({
    where,
    include: fileInclude,
  });
};

const listFiles = async (
  where: Prisma.FileWhereInput,
  orderBy: Prisma.FileOrderByWithRelationInput[],
  skip: number,
  take: number,
) => {
  const [data, total] = await Promise.all([
    prisma.file.findMany({
      where,
      orderBy,
      skip,
      take,
      include: fileInclude,
    }),
    prisma.file.count({ where }),
  ]);

  return { data, total };
};

const updateFile = async (fileId: string, data: Prisma.FileUpdateInput) => {
  return prisma.file.update({
    where: { id: fileId },
    data,
    include: fileInclude,
  });
};

const deleteFile = async (fileId: string) => {
  return prisma.file.delete({
    where: { id: fileId },
    include: fileInclude,
  });
};

const countPatient = async (patientId: string, tenantId: string) => {
  return prisma.patient.count({
    where: {
      id: patientId,
      tenantId,
      deletedAt: null,
    },
  });
};

const countDoctor = async (doctorId: string, tenantId: string) => {
  console.log('counting doctor with id', doctorId, 'and tenantId', tenantId);
  return prisma.doctor.count({
    where: {
      userId: doctorId,
      tenantId,
    },
  });
};

const countPrescription = async (prescriptionId: string, tenantId: string) => {
  return prisma.prescription.count({
    where: {
      id: prescriptionId,
      tenantId,
      deletedAt: null,
    },
  });
};

export const UploadRepository = {
  createFile,
  findFirstFile,
  listFiles,
  updateFile,
  deleteFile,
  countPatient,
  countDoctor,
  countPrescription,
};
