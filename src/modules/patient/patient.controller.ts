import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { PATIENT_MESSAGES } from './patient.constants';
import { PatientServices } from './patient.service';
import { generateText } from '../ai/ai.service';
import { buildPatientAnalysisPrompt } from '../ai/prompt/build-patient-analysis.prompt';

import type {
  TCreatePatientValidationInput,
  TListPatientsValidationInput,
  TUpdatePatientValidationInput,
} from './patient.validation';



const createPatient = catchAsync(async (req, res) => {
  const result = await PatientServices.createPatient(req.user, req.body as TCreatePatientValidationInput);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: PATIENT_MESSAGES.CREATED,
    data: result,
  });
});

const listPatients = catchAsync(async (req, res) => {
  const result = await PatientServices.listPatients(
    req.user,
    req.query as unknown as TListPatientsValidationInput,
  );


  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PATIENT_MESSAGES.LIST_RETRIEVED,
    data: result.data,
    meta: result.meta,
  });
});

const getPatientById = catchAsync(async (req, res) => {
  const result = await PatientServices.getPatientById(req.user, req.params['id'] as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PATIENT_MESSAGES.RETRIEVED,
    data: result,
  });
});

const updatePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.updatePatient(
    req.user,
    req.params['id'] as string,
    req.body as TUpdatePatientValidationInput,
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PATIENT_MESSAGES.UPDATED,
    data: result,
  });
});

const archivePatient = catchAsync(async (req, res) => {
  const result = await PatientServices.archivePatient(req.user, req.params['id'] as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PATIENT_MESSAGES.ARCHIVED,
    data: result,
  });
});

export const PatientControllers = {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  archivePatient,
};
