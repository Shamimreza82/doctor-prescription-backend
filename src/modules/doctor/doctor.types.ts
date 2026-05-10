import { AppointmentMode, ConsultationType, DayOfWeek, DoctorStatus, Gender } from '@prisma/client';

import { TJwtPayload } from '@/modules/auth/auth.utils';

export type TDoctorActor = TJwtPayload;

export interface TUpdateDoctorProfileInput {
  employeeId?: string;
  registrationNumber?: string;
  licenseNumber?: string;
  experienceYears?: number;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: string;
  bio?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  isAvailable?: boolean;
  consultationDuration?: number;
  status?: DoctorStatus;
}

export interface TChamberInput {
  name: string;
  roomNumber?: string;
  floor?: string;
  branchName?: string;
  address?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export interface TScheduleInput {
  chamberId?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  maxPatients?: number;
  slotDuration?: number;
  appointmentMode?: AppointmentMode;
  isActive?: boolean;
}

export interface TFeeConfigInput {
  id?: string;
  chamberId?: string;
  appointmentMode: AppointmentMode;
  consultationType: ConsultationType;
  amount: number;
  currency?: string;
  isActive?: boolean;
}

export interface TLeaveInput {
  startDate: string;
  endDate: string;
  reason?: string;
  isFullDay?: boolean;
}

export interface TDoctorListQuery {
  page?: number;
  limit?: number;
  status?: DoctorStatus;
  gender?: Gender;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
