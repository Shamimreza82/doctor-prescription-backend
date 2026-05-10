import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { DOCTOR_MESSAGES } from './doctor.consted';
import { DoctorServices } from './doctor.service';
import {
  TUpdateDoctorProfileInput,
  TDoctorListQuery,
  TChamberInput,
  TScheduleInput,
  TFeeConfigInput,
  TLeaveInput,
} from './doctor.types';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.getMyProfile(actor);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.PROFILE_FETCHED,
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.updateProfile(actor, req.body as TUpdateDoctorProfileInput);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.PROFILE_UPDATED,
    data: result,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const doctorId = req.params['id'] as string;
  const result = await DoctorServices.getDoctorById(actor, doctorId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.DOCTOR_FETCHED,
    data: result,
  });
});

const listDoctors = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.listDoctors(actor, req.query as unknown as TDoctorListQuery);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.DOCTORS_LISTED,
    data: result.data,
    meta: result.meta,
  });
});

// Chamber Controllers
const addChamber = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.addChamber(actor, req.body as TChamberInput);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: DOCTOR_MESSAGES.CHAMBER_ADDED,
    data: result,
  });
});

const getMyChambers = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.getMyChambers(actor);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.CHAMBERS_FETCHED,
    data: result,
  });
});

const updateChamber = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const chamberId = req.params['id'] as string;
  const result = await DoctorServices.updateChamber(actor, chamberId, req.body as TChamberInput);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.CHAMBER_UPDATED,
    data: result,
  });
});

const deleteChamber = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const chamberId = req.params['id'] as string;
  await DoctorServices.deleteChamber(actor, chamberId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.CHAMBER_DELETED,
  });
});

// Schedule Controllers
const addSchedule = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.addSchedule(actor, req.body as TScheduleInput);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: DOCTOR_MESSAGES.SCHEDULE_ADDED,
    data: result,
  });
});

const getMySchedules = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.getMySchedules(actor);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.SCHEDULES_FETCHED,
    data: result,
  });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const scheduleId = req.params['id'] as string;
  const result = await DoctorServices.updateSchedule(actor, scheduleId, req.body as TScheduleInput);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.SCHEDULE_UPDATED,
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const scheduleId = req.params['id'] as string;
  await DoctorServices.deleteSchedule(actor, scheduleId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.SCHEDULE_DELETED,
  });
});

// Fee Controllers
const updateFeeConfig = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.updateFeeConfig(actor, req.body as TFeeConfigInput);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.FEE_CONFIG_UPDATED,
    data: result,
  });
});

const getMyFees = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.getMyFees(actor);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.FEE_CONFIGS_FETCHED,
    data: result,
  });
});

const deleteFeeConfig = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const feeConfigId = req.params['id'] as string;
  await DoctorServices.deleteFeeConfig(actor, feeConfigId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.FEE_CONFIG_DELETED,
  });
});

// Leave Controllers
const addLeave = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.addLeave(actor, req.body as TLeaveInput);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: DOCTOR_MESSAGES.LEAVE_ADDED,
    data: result,
  });
});

const getMyLeaves = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const result = await DoctorServices.getMyLeaves(actor);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.LEAVES_FETCHED,
    data: result,
  });
});

const updateLeave = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const leaveId = req.params['id'] as string;
  const result = await DoctorServices.updateLeave(actor, leaveId, req.body as TLeaveInput);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.LEAVE_UPDATED,
    data: result,
  });
});

const deleteLeave = catchAsync(async (req: Request, res: Response) => {
  const actor = req.user;
  const leaveId = req.params['id'] as string;
  await DoctorServices.deleteLeave(actor, leaveId);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: DOCTOR_MESSAGES.LEAVE_DELETED,
  });
});

export const DoctorControllers = {
  getMyProfile,
  updateProfile,
  getDoctorById,
  listDoctors,
  addChamber,
  getMyChambers,
  updateChamber,
  deleteChamber,
  addSchedule,
  getMySchedules,
  updateSchedule,
  deleteSchedule,
  updateFeeConfig,
  getMyFees,
  deleteFeeConfig,
  addLeave,
  getMyLeaves,
  updateLeave,
  deleteLeave,
};
