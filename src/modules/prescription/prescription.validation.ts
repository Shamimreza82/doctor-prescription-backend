import { PrescriptionStatus } from '@prisma/client';
import { z } from 'zod';

const prescriptionItemSchema = z
  .object({
    medicineName: z.string().trim().min(1, 'Medicine name is required'),
    genericName: z.string().trim().min(1).nullable().optional(),
    dosage: z.string().trim().min(1).nullable().optional(),
    frequency: z.string().trim().min(1).nullable().optional(),
    durationValue: z.coerce.number().int().min(1).nullable().optional(),
    durationUnit: z.string().trim().min(1).nullable().optional(),
    route: z.string().trim().min(1).nullable().optional(),
    instruction: z.string().trim().min(1).nullable().optional(),
    quantity: z.string().trim().min(1).nullable().optional(),
    timing: z.string().trim().min(1).nullable().optional(),
    sortOrder: z.coerce.number().int().min(0).default(0),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  })
  .strip();

const prescriptionBodySchema = z
  .object({
    patientId: z.uuid('Invalid patient ID'),
    doctorId: z.uuid('Invalid doctor ID').optional(),
    visitId: z.uuid('Invalid visit ID').nullable().optional(),
    prescriptionNumber: z.string().trim().min(1).optional(),
    status: z.nativeEnum(PrescriptionStatus).optional(),
    diagnosis: z.string().trim().nullable().optional(),
    symptoms: z.string().trim().nullable().optional(),
    advice: z.string().trim().nullable().optional(),
    notes: z.string().trim().nullable().optional(),
    followUpDate: z.coerce.date().nullable().optional(),
    issuedAt: z.coerce.date().nullable().optional(),
    expiresAt: z.coerce.date().nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
    items: z.array(prescriptionItemSchema).default([]),
    tenantId: z.uuid('Invalid tenant ID').optional(),
  })
  .strip();

const createPrescriptionSchema = z.object({
  body: prescriptionBodySchema,
});

const updatePrescriptionSchema = z.object({
  body: prescriptionBodySchema.partial().refine(
    (value) => Object.keys(value).length > 0,
    'At least one field is required for update',
  ),
});

const prescriptionParamsSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid prescription ID'),
  }),
});

const listPrescriptionsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(10),
      search: z.string().trim().optional(),
      sortBy: z.enum(['createdAt', 'issuedAt', 'prescriptionNumber']).default('createdAt'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
      status: z.nativeEnum(PrescriptionStatus).optional(),
      patientId: z.uuid('Invalid patient ID').optional(),
      doctorId: z.uuid('Invalid doctor ID').optional(),
      tenantId: z.uuid('Invalid tenant ID').optional(),
      issuedFrom: z.coerce.date().optional(),
      issuedTo: z.coerce.date().optional(),
    })
    .strip(),
});

export const PrescriptionValidationSchemas = {
  createPrescriptionSchema,
  updatePrescriptionSchema,
  prescriptionParamsSchema,
  listPrescriptionsSchema,
};

export type TCreatePrescriptionValidationInput = z.infer<typeof createPrescriptionSchema>['body'];
export type TUpdatePrescriptionValidationInput = z.infer<typeof updatePrescriptionSchema>['body'];
export type TListPrescriptionsValidationInput = z.infer<typeof listPrescriptionsSchema>['query'];
