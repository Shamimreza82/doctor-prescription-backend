import { Gender, PatientStatus } from '@prisma/client';
import { z } from 'zod';

const patientBodySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  phone: z.string().trim().min(1, 'Phone is required'),
  email: z.email('Invalid email address').optional(),
  age: z.coerce.number().int().min(0).max(150).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.nativeEnum(Gender).optional(),
  address: z.string().trim().min(1).optional(),
  bloodGroup: z.string().trim().min(1).max(10).optional(),
  maritalStatus: z.string().trim().min(1).max(50).optional(),
  occupation: z.string().trim().min(1).max(100).optional(),
  photoUrl: z.url('Invalid photo URL').optional(),
  status: z.nativeEnum(PatientStatus).optional(),
  isActive: z.boolean().optional(),
  notes: z.string().trim().optional(),
  tenantId: z.uuid('Invalid tenant ID').optional(),
});

const createPatientSchema = z.object({
  body: patientBodySchema,
});

const updatePatientSchema = z.object({
  body: patientBodySchema.partial().refine(
    (value) => Object.keys(value).length > 0,
    'At least one field is required for update',
  ),
});

const patientParamsSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid patient ID'),
  }),
});

const listPatientsSchema = z.object({
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

export const PatientValidationSchemas = {
  createPatientSchema,
  updatePatientSchema,
  patientParamsSchema,
  listPatientsSchema,
};

export type TCreatePatientValidationInput = z.infer<typeof createPatientSchema>['body'];
export type TUpdatePatientValidationInput = z.infer<typeof updatePatientSchema>['body'];
export type TListPatientsValidationInput = z.infer<typeof listPatientsSchema>['query'];
