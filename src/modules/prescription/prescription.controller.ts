import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { PRESCRIPTION_MESSAGES } from './prescription.constants';
import { PrescriptionServices } from './prescription.service';

import type { TPrescriptionCreateInput, TPrescriptionUpdateInput } from './prescription.types';
import type {
  TListPrescriptionsValidationInput,
} from './prescription.validation';




const createPrescription = catchAsync(async (req, res) => {
  const result = await PrescriptionServices.createPrescription(
    req.user,
    req.body as TPrescriptionCreateInput,
  );

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: PRESCRIPTION_MESSAGES.CREATED,
    data: result,
  });
});

const listPrescriptions = catchAsync(async (req, res) => {
  const result = await PrescriptionServices.listPrescriptions(
    req.user,
    req.query as unknown as TListPrescriptionsValidationInput,
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PRESCRIPTION_MESSAGES.LIST_RETRIEVED,
    data: result.data,
    meta: result.meta,
  });
});

const getPrescriptionById = catchAsync(async (req, res) => {
  const result = await PrescriptionServices.getPrescriptionById(req.user, req.params['id'] as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PRESCRIPTION_MESSAGES.RETRIEVED,
    data: result,
  });
});

const updatePrescription = catchAsync(async (req, res) => {
  const result = await PrescriptionServices.updatePrescription(
    req.user,
    req.params['id'] as string,
    req.body as TPrescriptionUpdateInput,
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PRESCRIPTION_MESSAGES.UPDATED,
    data: result,
  });
});

const archivePrescription = catchAsync(async (req, res) => {
  const result = await PrescriptionServices.archivePrescription(req.user, req.params['id'] as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PRESCRIPTION_MESSAGES.ARCHIVED,
    data: result,
  });
});

export const PrescriptionControllers = {
  createPrescription,
  listPrescriptions,
  getPrescriptionById,
  updatePrescription,
  archivePrescription,
};
