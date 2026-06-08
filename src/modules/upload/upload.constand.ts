export const FILE_ENTITY_TYPES = ['PATIENT', 'DOCTOR', 'PRESCRIPTION'] as const;

export const FILE_CATEGORIES = [
  'LAB_REPORT',
  'PRESCRIPTION',
  'PROFILE_IMAGE',
  'NID',
  'INVOICE',
  'SIGNATURE',
  'OTHER',
] as const;

export const FILE_MESSAGES = {
  CREATED: 'File uploaded successfully',
  LIST_RETRIEVED: 'Files retrieved successfully',
  RETRIEVED: 'File retrieved successfully',
  UPDATED: 'File updated successfully',
  DELETED: 'File deleted successfully',
  NOT_FOUND: 'File not found',
  FILE_REQUIRED: 'File is required',
  TENANT_REQUIRED: 'Tenant is required',
  ENTITY_NOT_FOUND: 'Target entity not found',
} as const;

export const UPLOAD_FIELD_NAME = 'file';
export const UPLOAD_DIR = 'uploads';
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
