import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';
import { logAuditEvent } from '@/shared/logging/audit';

interface TAuditLogInput {
  hospitalId?: string;
  userId?: string;

  module: string;
  entity: string;
  entityId?: string;

  action: string;

  oldValues?: Prisma.InputJsonValue;
  newValues?: Prisma.InputJsonValue;

  ipAddress?: string;
  userAgent?: string;
}

export async function auditLog(data: TAuditLogInput) {
  try {
    if (!data.hospitalId) {
      throw new Error('Audit log requires hospitalId');
    }

    const createdAuditLog = await prisma.auditLog.create({
      data: {
        tenantId: data.hospitalId,
        userId: data.userId,
        module: data.module,
        entity: data.entity,
        entityId: data.entityId,
        action: data.action,
        oldValues: data.oldValues,
        newValues: data.newValues,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    logAuditEvent({
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      actorUserId: data.userId,
      hospitalId: data.hospitalId,
      ip: data.ipAddress,
      metadata: {
        auditLogId: createdAuditLog.id,
        module: data.module,
      },
    });
  } catch (error) {
    console.error(
      {
        err: error,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        userId: data.userId,
      },
      'Failed to persist audit log',
    );

    throw error;
  }
}
