import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';

export const DoctorRepository = {
  async findByUserId(userId: string, tenantId?: string) {
    return prisma.doctor.findUnique({
      where: {
        userId,
        ...(tenantId ? { tenantId } : {}),
      },
      include: {
        specializations: { include: { specialization: true } },
        qualifications: { include: { qualification: true } },
        departments: { include: { department: true } },
        chambers: true,
      },
    });
  },

  async findById(id: string, tenantId?: string) {
    return prisma.doctor.findFirst({
      where: {
        id,
        ...(tenantId ? { tenantId } : {}),
      },
      include: {
        specializations: { include: { specialization: true } },
        qualifications: { include: { qualification: true } },
        departments: { include: { department: true } },
        chambers: true,
      },
    });
  },

  async update(id: string, tenantId: string, data: Prisma.DoctorUpdateInput) {
    return prisma.doctor.update({
      where: { id, tenantId },
      data,
    });
  },

  async list(
    where: Prisma.DoctorWhereInput,
    orderBy: Prisma.DoctorOrderByWithRelationInput,
    skip: number,
    take: number,
  ) {
    return prisma.doctor.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        specializations: { include: { specialization: true } },
      },
    });
  },

  async count(where: Prisma.DoctorWhereInput) {
    return prisma.doctor.count({ where });
  },

  // Chambers
  async createChamber(data: Prisma.DoctorChamberCreateInput) {
    return prisma.doctorChamber.create({ data });
  },

  async updateChamber(id: string, doctorId: string, data: Prisma.DoctorChamberUpdateInput) {
    return prisma.doctorChamber.update({
      where: { id, doctorId },
      data,
    });
  },

  async deleteChamber(id: string, doctorId: string) {
    return prisma.doctorChamber.delete({
      where: { id, doctorId },
    });
  },

  async listChambers(doctorId: string) {
    return prisma.doctorChamber.findMany({ where: { doctorId } });
  },

  async findChamberById(id: string, doctorId?: string) {
    return prisma.doctorChamber.findFirst({
      where: {
        id,
        ...(doctorId ? { doctorId } : {}),
      },
    });
  },

  // Schedules
  async createSchedule(data: Prisma.DoctorScheduleCreateInput) {
    return prisma.doctorSchedule.create({ data });
  },

  async updateSchedule(id: string, doctorId: string, data: Prisma.DoctorScheduleUpdateInput) {
    return prisma.doctorSchedule.update({
      where: { id, doctorId },
      data,
    });
  },

  async deleteSchedule(id: string, doctorId: string) {
    return prisma.doctorSchedule.delete({
      where: { id, doctorId },
    });
  },

  async listSchedules(doctorId: string) {
    return prisma.doctorSchedule.findMany({
      where: { doctorId },
      include: { chamber: true },
    });
  },

  async findScheduleById(id: string, doctorId?: string) {
    return prisma.doctorSchedule.findFirst({
      where: {
        id,
        ...(doctorId ? { doctorId } : {}),
      },
    });
  },

  // Fee Configs
  async createFeeConfig(data: Prisma.DoctorFeeConfigCreateInput) {
    return prisma.doctorFeeConfig.create({ data });
  },

  async updateFeeConfig(id: string, doctorId: string, data: Prisma.DoctorFeeConfigUpdateInput) {
    return prisma.doctorFeeConfig.update({
      where: { id, doctorId },
      data,
    });
  },

  async deleteFeeConfig(id: string, doctorId: string) {
    return prisma.doctorFeeConfig.delete({
      where: { id, doctorId },
    });
  },

  async listFeeConfigs(doctorId: string) {
    return prisma.doctorFeeConfig.findMany({
      where: { doctorId },
      include: { chamber: true },
    });
  },

  async findFeeConfigById(id: string, doctorId?: string) {
    return prisma.doctorFeeConfig.findFirst({
      where: {
        id,
        ...(doctorId ? { doctorId } : {}),
      },
    });
  },

  // Leaves
  async createLeave(data: Prisma.DoctorLeaveCreateInput) {
    return prisma.doctorLeave.create({ data });
  },

  async updateLeave(id: string, doctorId: string, data: Prisma.DoctorLeaveUpdateInput) {
    return prisma.doctorLeave.update({
      where: { id, doctorId },
      data,
    });
  },

  async deleteLeave(id: string, doctorId: string) {
    return prisma.doctorLeave.delete({
      where: { id, doctorId },
    });
  },

  async listLeaves(doctorId: string) {
    return prisma.doctorLeave.findMany({ where: { doctorId } });
  },

  async findLeaveById(id: string, doctorId?: string) {
    return prisma.doctorLeave.findFirst({
      where: {
        id,
        ...(doctorId ? { doctorId } : {}),
      },
    });
  },
};
