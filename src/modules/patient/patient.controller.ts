import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { PATIENT_MESSAGES } from './patient.constants';
import { PatientServices } from './patient.service';

import type {
  TCreatePatientValidationInput,
  TCreateVisitValidationInput,
  TListPatientsValidationInput,
  TListVisitsValidationInput,
  TUpdateMedicalProfileValidationInput,
  TUpdatePatientValidationInput,
  TUpdateVisitValidationInput,
  TVisitVitalsValidationInput,
} from './patient.validation';

const createPatient = catchAsync(async (req, res) => {
  const result = await PatientServices.createPatient(
    req.user,
    req.body as TCreatePatientValidationInput,
  );

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

const getMedicalProfile = catchAsync(async (req, res) => {
  const result = await PatientServices.getMedicalProfile(req.user, req.params['id'] as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PATIENT_MESSAGES.MEDICAL_PROFILE_RETRIEVED,
    data: result,
  });
});

const updateMedicalProfile = catchAsync(async (req, res) => {
  const result = await PatientServices.updateMedicalProfile(
    req.user,
    req.params['id'] as string,
    req.body as TUpdateMedicalProfileValidationInput,
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PATIENT_MESSAGES.MEDICAL_PROFILE_UPDATED,
    data: result,
  });
});

// Visit Controllers
const createVisit = catchAsync(async (req, res) => {
  const result = await PatientServices.createVisit(
    req.user,
    req.params['id'] as string,
    req.body as TCreateVisitValidationInput,
  );

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: 'Visit created successfully',
    data: result,
  });
});

const listVisits = catchAsync(async (req, res) => {
  const result = await PatientServices.listVisits(
    req.user,
    req.params['id'] as string,
    req.query as unknown as TListVisitsValidationInput,
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Visits retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getVisitById = catchAsync(async (req, res) => {
  const result = await PatientServices.getVisitById(
    req.user,
    req.params['id'] as string,
    req.params['visitId'] as string,
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Visit retrieved successfully',
    data: result,
  });
});

const updateVisit = catchAsync(async (req, res) => {
  const result = await PatientServices.updateVisit(
    req.user,
    req.params['id'] as string,
    req.params['visitId'] as string,
    req.body as TUpdateVisitValidationInput,
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Visit updated successfully',
    data: result,
  });
});

const getVisitVitals = catchAsync(async (req, res) => {
  const result = await PatientServices.getVisitVitals(
    req.user,
    req.params['id'] as string,
    req.params['visitId'] as string,
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PATIENT_MESSAGES.VITALS_RETRIEVED,
    data: result,
  });
});

const recordVisitVitals = catchAsync(async (req, res) => {
  const result = await PatientServices.recordVisitVitals(
    req.user,
    req.params['id'] as string,
    req.params['visitId'] as string,
    req.body as TVisitVitalsValidationInput,
  );

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: PATIENT_MESSAGES.VITALS_RECORDED,
    data: result,
  });
});

export const PatientControllers = {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  archivePatient,
  getMedicalProfile,
  updateMedicalProfile,
  createVisit,
  listVisits,
  getVisitById,
  updateVisit,
  getVisitVitals,
  recordVisitVitals,
};
