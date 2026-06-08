import { Prisma, Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';

import { DoctorRepository } from './doctor.repository';
import { TDoctorActor } from './doctor.types';

export const DoctorUtils = {
  resolveTenantScope(actor: TDoctorActor) {
    return {
      tenantId: actor.tenantId,
      userId: actor.userId,
      role: actor.role,
    };
  },

  async getScopedDoctorOrThrow(userId: string, tenantId?: string) {
    // If tenantId is provided, we filter by it.
    // If not (e.g. Super Admin), we just find by userId.
    const doctor = await DoctorRepository.findByUserId(userId, tenantId);
    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Doctor profile not found');
    }
    return doctor;
  },

  async getDoctorByIdOrThrow(id: string, tenantId?: string) {
    const doctor = await DoctorRepository.findById(id, tenantId);
    if (!doctor) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Doctor not found');
    }
    return doctor;
  },

  buildDoctorListWhere(actor: TDoctorActor, query: any): Prisma.DoctorWhereInput {
    const where: Prisma.DoctorWhereInput = {};

    // Only filter by tenantId if NOT a super admin
    if (actor.role !== Role.SUPER_ADMIN) {
      where.tenantId = actor.tenantId;
    } else if (query.tenantId) {
      // Super admin can filter by a specific tenantId if they want
      where.tenantId = query.tenantId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.gender) {
      where.gender = query.gender;
    }

    return where;
  },

  buildOrderBy(sortBy?: string, sortOrder?: 'asc' | 'desc'): Prisma.DoctorOrderByWithRelationInput {
    const order: Prisma.DoctorOrderByWithRelationInput = {};
    const field = sortBy ?? 'createdAt';
    const direction = sortOrder ?? 'desc';

    // @ts-ignore - dynamic field access
    order[field] = direction;

    return order;
  },
};
