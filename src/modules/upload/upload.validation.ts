import { z } from 'zod';

import { FILE_CATEGORIES, FILE_ENTITY_TYPES } from './upload.constand';

const fileBodySchema = z.object({
  entityType: z.enum(FILE_ENTITY_TYPES),
  entityId: z.uuid('Invalid entity ID'),
  category: z.enum(FILE_CATEGORIES).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  notes: z.string().trim().max(1000).optional(),
  tenantId: z.uuid('Invalid tenant ID').optional(),
});

const createFileSchema = z.object({
  body: fileBodySchema,
});

const updateFileSchema = z.object({
  body: z
    .object({
      category: z.enum(FILE_CATEGORIES).nullable().optional(),
      title: z.string().trim().min(1).max(200).nullable().optional(),
      notes: z.string().trim().max(1000).nullable().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required for update'),
});

const fileParamsSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid file ID'),
  }),
});

const listFilesSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(10),
      entityType: z.enum(FILE_ENTITY_TYPES).optional(),
      entityId: z.uuid('Invalid entity ID').optional(),
      category: z.enum(FILE_CATEGORIES).optional(),
      search: z.string().trim().optional(),
      tenantId: z.uuid('Invalid tenant ID').optional(),
      sortBy: z.enum(['createdAt', 'originalName', 'sizeBytes']).default('createdAt'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
    })
    .strip(),
});

export const UploadValidationSchemas = {
  createFileSchema,
  updateFileSchema,
  fileParamsSchema,
  listFilesSchema,
};

export type TCreateFileValidationInput = z.infer<typeof createFileSchema>['body'];
export type TUpdateFileValidationInput = z.infer<typeof updateFileSchema>['body'];
export type TListFilesValidationInput = z.infer<typeof listFilesSchema>['query'];
