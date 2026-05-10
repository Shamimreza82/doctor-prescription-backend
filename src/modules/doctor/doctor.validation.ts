import { z } from 'zod';

const updateDoctorProfileSchema = z.object({
  body: z.object({
    employeeId: z.string().optional(),
    registrationNumber: z.string().optional(),
    licenseNumber: z.string().optional(),
    experienceYears: z.number().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    dateOfBirth: z.string().optional(), // Will be converted to Date
    bloodGroup: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    isAvailable: z.boolean().optional(),
    consultationDuration: z.number().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RETIRED']).optional(),
  }),
});

const chamberSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Chamber name is required'),
    roomNumber: z.string().optional(),
    floor: z.string().optional(),
    branchName: z.string().optional(),
    address: z.string().optional(),
    isPrimary: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

const scheduleSchema = z.object({
  body: z.object({
    chamberId: z.string().optional(),
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Invalid start time format (HH:mm)'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Invalid end time format (HH:mm)'),
    maxPatients: z.number().optional(),
    slotDuration: z.number().optional(),
    appointmentMode: z.enum(['IN_PERSON', 'ONLINE', 'VIDEO', 'PHONE']).optional(),
    isActive: z.boolean().optional(),
  }),
});

const feeConfigSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    chamberId: z.string().optional(),
    appointmentMode: z.enum(['IN_PERSON', 'ONLINE', 'VIDEO', 'PHONE']),
    consultationType: z.enum(['NEW', 'FOLLOW_UP', 'EMERGENCY']),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().default('BDT'),
    isActive: z.boolean().optional(),
  }),
});

const leaveSchema = z.object({
  body: z.object({
    startDate: z.string(),
    endDate: z.string(),
    reason: z.string().optional(),
    isFullDay: z.boolean().optional(),
  }),
});

export const DoctorValidationSchemas = {
  updateDoctorProfileSchema,
  chamberSchema,
  scheduleSchema,
  feeConfigSchema,
  leaveSchema,
};

export type TUpdateDoctorProfileInput = z.infer<typeof updateDoctorProfileSchema>['body'];
export type TChamberInput = z.infer<typeof chamberSchema>['body'];
export type TScheduleInput = z.infer<typeof scheduleSchema>['body'];
export type TFeeConfigInput = z.infer<typeof feeConfigSchema>['body'];
export type TLeaveInput = z.infer<typeof leaveSchema>['body'];
