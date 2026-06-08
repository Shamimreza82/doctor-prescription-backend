import {
  AddressType,
  Gender,
  PatientIdentifierType,
  PatientStatus,
  VisitPriority,
  VisitSource,
  VisitStatus,
  VisitType,
} from '@prisma/client';
import { z } from 'zod';

const addressSchema = z.object({
  type: z.nativeEnum(AddressType).default(AddressType.HOME),
  addressLine: z.string().trim().min(1, 'Address line is required'),
  area: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  country: z.string().trim().optional(),
  isPrimary: z.boolean().default(false),
});

const emergencyContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  relation: z.string().trim().optional(),
  phone: z.string().trim().min(1, 'Phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().trim().optional(),
  isPrimary: z.boolean().default(false),
});

const medicalProfileSchema = z.object({
  allergies: z.string().trim().optional(),
  chronicDiseases: z.string().trim().optional(),
  currentMedications: z.string().trim().optional(),
  pastMedicalHistory: z.string().trim().optional(),
  familyHistory: z.string().trim().optional(),
  surgicalHistory: z.string().trim().optional(),
  habits: z.string().trim().optional(),
  heightCm: z.number().min(0).optional(),
  weightKg: z.number().min(0).optional(),
});

const insuranceSchema = z.object({
  providerName: z.string().trim().min(1, 'Provider name is required'),
  policyNumber: z.string().trim().optional(),
  memberId: z.string().trim().optional(),
  coverageDetails: z.string().trim().optional(),
  validFrom: z.coerce.date().optional(),
  validTo: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});

const identifierSchema = z.object({
  type: z.nativeEnum(PatientIdentifierType),
  value: z.string().trim().min(1, 'Value is required'),
  isPrimary: z.boolean().default(false),
});

const patientBodySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  phone: z.string().trim().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  age: z.coerce.number().int().min(0).max(150).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.nativeEnum(Gender).optional(),
  bloodGroup: z.string().trim().min(1).max(10).optional(),
  maritalStatus: z.string().trim().min(1).max(50).optional(),
  occupation: z.string().trim().min(1).max(100).optional(),
  photoUrl: z.string().url('Invalid photo URL').optional().or(z.literal('')),
  status: z.nativeEnum(PatientStatus).optional(),
  isActive: z.boolean().optional(),
  notes: z.string().trim().optional(),
  tenantId: z.string().uuid('Invalid tenant ID').optional(),

  // Nested relations
  addresses: z.array(addressSchema).optional(),
  emergencyContacts: z.array(emergencyContactSchema).optional(),
  medicalProfile: medicalProfileSchema.optional(),
  insurances: z.array(insuranceSchema).optional(),
  identifiers: z.array(identifierSchema).optional(),
});

export const createPatientSchema = z.object({
  body: patientBodySchema,
});

export const updatePatientSchema = z.object({
  body: patientBodySchema
    .partial()
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required for update'),
});

export const patientParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid patient ID'),
  }),
});

export const updateMedicalProfileSchema = z.object({
  body: medicalProfileSchema,
});

export const listPatientsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(10),
      search: z.string().trim().optional(),
      sortBy: z.enum(['createdAt', 'name']).default('createdAt'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
      gender: z.nativeEnum(Gender).optional(),
      status: z.nativeEnum(PatientStatus).optional(),
      isActive: z.coerce.boolean().optional(),
    })
    .strip(),
});

export const createVisitSchema = z.object({
  body: z.object({
    visitDate: z.coerce.date().default(() => new Date()),
    type: z.nativeEnum(VisitType).default(VisitType.OPD),
    status: z.nativeEnum(VisitStatus).default(VisitStatus.SCHEDULED),
    priority: z.nativeEnum(VisitPriority).default(VisitPriority.NORMAL),
    source: z.nativeEnum(VisitSource).default(VisitSource.DIRECT),
    chiefComplaint: z.string().trim().optional(),
    reason: z.string().trim().optional(),
    symptoms: z.string().trim().optional(),
    diagnosis: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    queueNumber: z.number().int().min(1).optional(),
    roomNumber: z.string().trim().optional(),
    departmentId: z.string().uuid().optional(),
    consultationFee: z.number().min(0).optional(),
    discount: z.number().min(0).optional(),
    followUpDate: z.coerce.date().optional(),
    referredToDoctorId: z.string().uuid().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid patient ID'),
  }),
});

export const updateVisitSchema = z.object({
  body: z
    .object({
      visitDate: z.coerce.date().optional(),
      type: z.nativeEnum(VisitType).optional(),
      status: z.nativeEnum(VisitStatus).optional(),
      priority: z.nativeEnum(VisitPriority).optional(),
      source: z.nativeEnum(VisitSource).optional(),
      chiefComplaint: z.string().trim().optional(),
      reason: z.string().trim().optional(),
      symptoms: z.string().trim().optional(),
      diagnosis: z.string().trim().optional(),
      notes: z.string().trim().optional(),
      checkedInAt: z.coerce.date().optional(),
      startedAt: z.coerce.date().optional(),
      completedAt: z.coerce.date().optional(),
      closedAt: z.coerce.date().optional(),
      queueNumber: z.number().int().min(1).optional(),
      roomNumber: z.string().trim().optional(),
      departmentId: z.string().uuid().optional(),
      consultationFee: z.number().min(0).optional(),
      discount: z.number().min(0).optional(),
      paidAmount: z.number().min(0).optional(),
      followUpDate: z.coerce.date().optional(),
      referredToDoctorId: z.string().uuid().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    })
    .partial(),
  params: z.object({
    id: z.string().uuid('Invalid patient ID'),
    visitId: z.string().uuid('Invalid visit ID'),
  }),
});

export const listVisitsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    status: z.nativeEnum(VisitStatus).optional(),
    type: z.nativeEnum(VisitType).optional(),
    priority: z.nativeEnum(VisitPriority).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid patient ID'),
  }),
});

export const visitVitalsSchema = z.object({
  body: z.object({
    systolicBp: z.number().int().min(0).max(300).optional(),
    diastolicBp: z.number().int().min(0).max(200).optional(),
    pulseRate: z.number().int().min(0).max(300).optional(),
    temperature: z.number().min(0).max(120).optional(),
    respiratoryRate: z.number().int().min(0).max(100).optional(),
    spO2: z.number().int().min(0).max(100).optional(),
    bmi: z.number().min(0).optional(),
    weightKg: z.number().min(0).optional(),
    heightCm: z.number().min(0).optional(),
    notes: z.string().trim().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid patient ID'),
    visitId: z.string().uuid('Invalid visit ID'),
  }),
});

export const PatientValidationSchemas = {
  createPatientSchema,
  updatePatientSchema,
  patientParamsSchema,
  listPatientsSchema,
  createVisitSchema,
  updateVisitSchema,
  listVisitsSchema,
  visitVitalsSchema,
  updateMedicalProfileSchema,
};

export type TCreatePatientValidationInput = z.infer<typeof createPatientSchema>['body'];
export type TUpdatePatientValidationInput = z.infer<typeof updatePatientSchema>['body'];
export type TUpdateMedicalProfileValidationInput = z.infer<
  typeof updateMedicalProfileSchema
>['body'];
export type TListPatientsValidationInput = z.infer<typeof listPatientsSchema>['query'];
export type TCreateVisitValidationInput = z.infer<typeof createVisitSchema>['body'];
export type TUpdateVisitValidationInput = z.infer<typeof updateVisitSchema>['body'];
export type TListVisitsValidationInput = z.infer<typeof listVisitsSchema>['query'];
export type TVisitVitalsValidationInput = z.infer<typeof visitVitalsSchema>['body'];
