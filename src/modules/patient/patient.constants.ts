export const PATIENT_MESSAGES = {
  CREATED: 'Patient created successfully',
  LIST_RETRIEVED: 'Patients retrieved successfully',
  RETRIEVED: 'Patient retrieved successfully',
  UPDATED: 'Patient updated successfully',
  ARCHIVED: 'Patient archived successfully',
  NOT_FOUND: 'Patient not found',
  TENANT_REQUIRED: 'Tenant ID is required for patient operations',
} as const;

export const PATIENT_SORT_FIELDS = ['createdAt', 'name'] as const;
