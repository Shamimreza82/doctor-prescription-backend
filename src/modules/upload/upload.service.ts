import fs from 'node:fs/promises';

import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';
import { paginateResponse } from '@/shared/utils/paginateResponse';
import { calculatePagination } from '@/shared/utils/pagination';

import { FILE_MESSAGES } from './upload.constand';
import { UploadRepository } from './upload.repository';
import { UploadUtils } from './upload.utlis';

import type {
  TCreateFileInput,
  TListFilesQuery,
  TUpdateFileInput,
  TUploadActor,
  TUploadedFile,
} from './upload.types';


const unlinkFile = async (storageKey: string) => {
  try {
    await fs.unlink(storageKey);
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;

    if (code !== 'ENOENT') {
      throw error;
    }
  }
};


const uploadFile = async (
  actor: TUploadActor,
  payload: TCreateFileInput,
  file?: TUploadedFile,
) => {


  const { entityType, entityId } = {...payload}

  if (!file) {
    throw new AppError(StatusCodes.BAD_REQUEST, FILE_MESSAGES.FILE_REQUIRED);
  }

  try {
    const scope = UploadUtils.resolveTenantScope(actor, actor.tenantId);


    if (!scope.tenantId) {
      throw new AppError(StatusCodes.BAD_REQUEST, FILE_MESSAGES.TENANT_REQUIRED);
    }

    await UploadUtils.assertEntityBelongsToTenant(entityType, entityId, scope.tenantId);

    return UploadRepository.createFile({
      tenant: {
        connect: {
          id: scope.tenantId,
        },
      },
      uploadedBy: {
        connect: {
          id: actor.userId,
        },
      },
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageKey: file.path,
      entityType: entityType,
      entityId: entityId,
      category: payload.category,
      title: payload.title,
      notes: payload.notes,
    });
  } catch (error) {
    await unlinkFile(file.path);
    throw error;
  }
};

const listFiles = async (actor: TUploadActor, query: TListFilesQuery) => {
  const scope = UploadUtils.resolveTenantScope(actor, query.tenantId);
  const { page, limit, skip } = calculatePagination(query);
  const where = UploadUtils.buildFileListWhere(scope, query);
  const orderBy = UploadUtils.buildOrderBy(query.sortBy, query.sortOrder);
  const { data, total } = await UploadRepository.listFiles(where, orderBy, skip, limit);

  return paginateResponse(data, total, page, limit);
};

const getFileById = async (actor: TUploadActor, fileId: string) => {
  const scope = UploadUtils.resolveTenantScope(actor);
  return UploadUtils.getScopedFileOrThrow(fileId, scope);
};

const updateFile = async (actor: TUploadActor, fileId: string, payload: TUpdateFileInput) => {
  const scope = UploadUtils.resolveTenantScope(actor);
  await UploadUtils.getScopedFileOrThrow(fileId, scope);

  const data: Prisma.FileUpdateInput = {};

  if (payload.category !== undefined) {
    data.category = payload.category;
  }

  if (payload.title !== undefined) {
    data.title = payload.title;
  }

  if (payload.notes !== undefined) {
    data.notes = payload.notes;
  }

  return UploadRepository.updateFile(fileId, data);
};

const deleteFile = async (actor: TUploadActor, fileId: string) => {
  const scope = UploadUtils.resolveTenantScope(actor);
  const file = await UploadUtils.getScopedFileOrThrow(fileId, scope);
  const deleted = await UploadRepository.deleteFile(fileId);

  await unlinkFile(file.storageKey);

  return deleted;
};

export const UploadServices = {
  uploadFile,
  listFiles,
  getFileById,
  updateFile,
  deleteFile,
};
