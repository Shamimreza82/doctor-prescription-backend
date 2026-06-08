export const uploadSchemas = {
  File: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      originalName: { type: 'string' },
      mimeType: { type: 'string' },
      sizeBytes: { type: 'integer' },
      storageKey: { type: 'string' },
      entityType: { type: 'string' },
      entityId: { type: 'string' },
      category: { type: 'string', nullable: true },
      title: { type: 'string', nullable: true },
      notes: { type: 'string', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      tenantId: { type: 'string', format: 'uuid' },
      uploadedById: { type: 'string', format: 'uuid', nullable: true },
      patientId: { type: 'string', format: 'uuid', nullable: true },
    },
  },
  UploadFileRequest: {
    type: 'object',
    required: ['file', 'entityType', 'entityId'],
    properties: {
      file: { type: 'string', format: 'binary' },
      entityType: { type: 'string' },
      entityId: { type: 'string' },
      category: { type: 'string' },
      title: { type: 'string' },
      notes: { type: 'string' },
    },
  },
  UpdateFileRequest: {
    type: 'object',
    properties: {
      category: { type: 'string' },
      title: { type: 'string' },
      notes: { type: 'string' },
    },
  },
  FileResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      data: { $ref: '#/components/schemas/File' },
    },
  },
  FileListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/File' },
      },
      meta: { $ref: '#/components/schemas/PaginationMeta' },
    },
  },
};
