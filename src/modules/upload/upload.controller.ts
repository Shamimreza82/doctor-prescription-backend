import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { FILE_MESSAGES } from './upload.constand';
import { UploadServices } from './upload.service';

import type {
  TCreateFileValidationInput,
  TListFilesValidationInput,
  TUpdateFileValidationInput,
} from './upload.validation';

const uploadFile = catchAsync(async (req, res) => {
  const result = await UploadServices.uploadFile(
    req.user,
    req.body as TCreateFileValidationInput,
    req.file,
  );

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: FILE_MESSAGES.CREATED,
    data: result,
  });
});

const listFiles = catchAsync(async (req, res) => {
  const result = await UploadServices.listFiles(
    req.user,
    req.query as unknown as TListFilesValidationInput,
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: FILE_MESSAGES.LIST_RETRIEVED,
    data: result.data,
    meta: result.meta,
  });
});

const getFileById = catchAsync(async (req, res) => {
  const result = await UploadServices.getFileById(req.user, req.params['id'] as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: FILE_MESSAGES.RETRIEVED,
    data: result,
  });
});

const updateFile = catchAsync(async (req, res) => {
  const result = await UploadServices.updateFile(
    req.user,
    req.params['id'] as string,
    req.body as TUpdateFileValidationInput,
  );

  

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: FILE_MESSAGES.UPDATED,
    data: result,
  });
});

const deleteFile = catchAsync(async (req, res) => {
  const result = await UploadServices.deleteFile(req.user, req.params['id'] as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: FILE_MESSAGES.DELETED,
    data: result,
  });
});

export const UploadControllers = {
  uploadFile,
  listFiles,
  getFileById,
  updateFile,
  deleteFile,
};
