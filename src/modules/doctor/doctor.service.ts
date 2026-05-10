import { Prisma } from '@prisma/client';

import { paginateResponse } from '@/shared/utils/paginateResponse';
import { calculatePagination } from '@/shared/utils/pagination';

import { DoctorRepository } from './doctor.repository';
import {
  TDoctorActor,
  TDoctorListQuery,
  TUpdateDoctorProfileInput,
  TChamberInput,
  TScheduleInput,
  TFeeConfigInput,
  TLeaveInput,
} from './doctor.types';
import { DoctorUtils } from './doctor.utils';

const getMyProfile = async (actor: TDoctorActor) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  return DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);
};

const updateProfile = async (actor: TDoctorActor, payload: TUpdateDoctorProfileInput) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  const data: Prisma.DoctorUpdateInput = {
    employeeId: payload.employeeId,
    registrationNumber: payload.registrationNumber,
    licenseNumber: payload.licenseNumber,
    experienceYears: payload.experienceYears,
    gender: payload.gender,
    dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined,
    bloodGroup: payload.bloodGroup,
    bio: payload.bio,
    address: payload.address,
    emergencyContactName: payload.emergencyContactName,
    emergencyContactPhone: payload.emergencyContactPhone,
    isAvailable: payload.isAvailable,
    consultationDuration: payload.consultationDuration,
    status: payload.status,
  };

  return DoctorRepository.update(doctor.id, scope.tenantId, data);
};

const getDoctorById = async (actor: TDoctorActor, id: string) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  return DoctorUtils.getDoctorByIdOrThrow(id, scope.tenantId);
};

const listDoctors = async (actor: TDoctorActor, query: TDoctorListQuery) => {
  const { page, limit, skip } = calculatePagination(query);
  const where = DoctorUtils.buildDoctorListWhere(actor, query);
  const orderBy = DoctorUtils.buildOrderBy(query.sortBy, query.sortOrder);

  const [data, total] = await Promise.all([
    DoctorRepository.list(where, orderBy, skip, limit),
    DoctorRepository.count(where),
  ]);

  return paginateResponse(data, total, page, limit);
};

// Chamber Services
const addChamber = async (actor: TDoctorActor, payload: TChamberInput) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  return DoctorRepository.createChamber({
    ...payload,
    doctor: { connect: { id: doctor.id } },
  });
};

const getMyChambers = async (actor: TDoctorActor) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);
  return DoctorRepository.listChambers(doctor.id);
};

const updateChamber = async (actor: TDoctorActor, chamberId: string, payload: TChamberInput) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  return DoctorRepository.updateChamber(chamberId, doctor.id, payload);
};

const deleteChamber = async (actor: TDoctorActor, chamberId: string) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  return DoctorRepository.deleteChamber(chamberId, doctor.id);
};

// Schedule Services
const addSchedule = async (actor: TDoctorActor, payload: TScheduleInput) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  const { chamberId, ...rest } = payload;

  return DoctorRepository.createSchedule({
    ...rest,
    doctor: { connect: { id: doctor.id } },
    chamber: chamberId ? { connect: { id: chamberId } } : undefined,
  });
};

const getMySchedules = async (actor: TDoctorActor) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);
  return DoctorRepository.listSchedules(doctor.id);
};

const updateSchedule = async (actor: TDoctorActor, scheduleId: string, payload: TScheduleInput) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  const { chamberId, ...rest } = payload;

  return DoctorRepository.updateSchedule(scheduleId, doctor.id, {
    ...rest,
    chamber: chamberId ? { connect: { id: chamberId } } : { disconnect: true },
  });
};

const deleteSchedule = async (actor: TDoctorActor, scheduleId: string) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  return DoctorRepository.deleteSchedule(scheduleId, doctor.id);
};

// Fee Config Services
const updateFeeConfig = async (actor: TDoctorActor, payload: TFeeConfigInput) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  const { id, chamberId, ...rest } = payload;

  if (id) {
    return DoctorRepository.updateFeeConfig(id, doctor.id, {
      ...rest,
      chamber: chamberId ? { connect: { id: chamberId } } : { disconnect: true },
    });
  }

  return DoctorRepository.createFeeConfig({
    ...rest,
    doctor: { connect: { id: doctor.id } },
    chamber: chamberId ? { connect: { id: chamberId } } : undefined,
  });
};

const getMyFees = async (actor: TDoctorActor) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);
  return DoctorRepository.listFeeConfigs(doctor.id);
};

const deleteFeeConfig = async (actor: TDoctorActor, feeConfigId: string) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  return DoctorRepository.deleteFeeConfig(feeConfigId, doctor.id);
};

// Leave Services
const addLeave = async (actor: TDoctorActor, payload: TLeaveInput) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  return DoctorRepository.createLeave({
    startDate: new Date(payload.startDate),
    endDate: new Date(payload.endDate),
    reason: payload.reason,
    isFullDay: payload.isFullDay,
    doctor: { connect: { id: doctor.id } },
  });
};

const getMyLeaves = async (actor: TDoctorActor) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);
  return DoctorRepository.listLeaves(doctor.id);
};

const updateLeave = async (actor: TDoctorActor, leaveId: string, payload: TLeaveInput) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  return DoctorRepository.updateLeave(leaveId, doctor.id, {
    startDate: payload.startDate ? new Date(payload.startDate) : undefined,
    endDate: payload.endDate ? new Date(payload.endDate) : undefined,
    reason: payload.reason,
    isFullDay: payload.isFullDay,
  });
};

const deleteLeave = async (actor: TDoctorActor, leaveId: string) => {
  const scope = DoctorUtils.resolveTenantScope(actor);
  const doctor = await DoctorUtils.getScopedDoctorOrThrow(scope.userId, scope.tenantId);

  return DoctorRepository.deleteLeave(leaveId, doctor.id);
};

export const DoctorServices = {
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
