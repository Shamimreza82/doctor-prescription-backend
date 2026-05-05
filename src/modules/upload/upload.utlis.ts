import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';

import { FILE_ENTITY_TYPES, FILE_MESSAGES, UPLOAD_DIR } from './upload.constand';
import { UploadRepository } from './upload.repository';

import type { TFileEntityType, TListFilesQuery, TUploadActor, TUploadScope } from './upload.types';

const resolveTenantScope = (actor: TUploadActor, requestedTenantId?: string): TUploadScope => {
  const isSuperAdmin = actor.role === 'SUPER_ADMIN';

  if (isSuperAdmin) {
    return {
      tenantId: requestedTenantId,
      isSuperAdmin: true,
    };
  }

  if (!actor.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, FILE_MESSAGES.TENANT_REQUIRED);
  }

  return {
    tenantId: actor.tenantId,
    isSuperAdmin: false,
  };
};

const buildTenantWhere = (scope: TUploadScope): Prisma.FileWhereInput => {
  if (scope.isSuperAdmin && !scope.tenantId) {
    return {};
  }

  if (!scope.tenantId) {
    throw new AppError(StatusCodes.BAD_REQUEST, FILE_MESSAGES.TENANT_REQUIRED);
  }

  return {
    tenantId: scope.tenantId,
  };
};

const buildFileListWhere = (scope: TUploadScope, query: TListFilesQuery): Prisma.FileWhereInput => {
  const filters: Prisma.FileWhereInput = {
    ...buildTenantWhere(scope),
  };

  if (query.entityType) {
    filters.entityType = query.entityType;
  }

  if (query.entityId) {
    filters.entityId = query.entityId;
  }

  const search = query.search?.trim();
  if (search) {
    filters.OR = [
      {
        originalName: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        notes: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  return filters;
};

const buildOrderBy = (
  sortBy: TListFilesQuery['sortBy'] = 'createdAt',
  sortOrder: TListFilesQuery['sortOrder'] = 'desc',
): Prisma.FileOrderByWithRelationInput[] => {
  if (sortBy === 'originalName') {
    return [{ originalName: sortOrder }];
  }

  if (sortBy === 'sizeBytes') {
    return [{ sizeBytes: sortOrder }];
  }

  return [{ createdAt: sortOrder }];
};

const getScopedFileOrThrow = async (fileId: string, scope: TUploadScope) => {
  const file = await UploadRepository.findFirstFile({
    id: fileId,
    ...buildTenantWhere(scope),
  });

  if (!file) {
    throw new AppError(StatusCodes.NOT_FOUND, FILE_MESSAGES.NOT_FOUND);
  }

  return file;
};

const assertEntityBelongsToTenant = async (
  entityType: TFileEntityType,
  entityId: string,
  tenantId: string,
) => {
  let count = 0;

  if (entityType === FILE_ENTITY_TYPES[0]) {
    count = await UploadRepository.countPatient(entityId, tenantId);
  } else if (entityType === FILE_ENTITY_TYPES[1]) {
    count = await UploadRepository.countDoctor(entityId, tenantId);
  } else if (entityType === FILE_ENTITY_TYPES[2]) {
    count = await UploadRepository.countPrescription(entityId, tenantId);
  }

  if (!count) {
    throw new AppError(StatusCodes.NOT_FOUND, FILE_MESSAGES.ENTITY_NOT_FOUND);
  }
};

const getUploadDirectory = () => path.resolve(process.cwd(), UPLOAD_DIR);

const ensureUploadDirectory = (directory = getUploadDirectory()) => {
  fs.mkdirSync(directory, { recursive: true });
  return directory;
};

const buildStoredFileName = (originalName: string) => {
  const extension = path.extname(originalName);
  return `${Date.now()}-${randomUUID()}${extension}`;
};

export const UploadUtils = {
  resolveTenantScope,
  buildTenantWhere,
  buildFileListWhere,
  buildOrderBy,
  getScopedFileOrThrow,
  assertEntityBelongsToTenant,
  getUploadDirectory,
  ensureUploadDirectory,
  buildStoredFileName,
};
