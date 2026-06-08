export const uploadPaths = {
  '/files': {
    post: {
      tags: ['Files'],
      summary: 'Upload a file',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: { $ref: '#/components/schemas/UploadFileRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'File uploaded successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/FileResponse' } },
          },
        },
      },
    },
    get: {
      tags: ['Files'],
      summary: 'List files',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
        { in: 'query', name: 'entityType', schema: { type: 'string' } },
        { in: 'query', name: 'entityId', schema: { type: 'string' } },
      ],
      responses: {
        '200': {
          description: 'Files retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/FileListResponse' } },
          },
        },
      },
    },
  },
  '/files/{id}': {
    get: {
      tags: ['Files'],
      summary: 'Get file by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'File retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/FileResponse' } },
          },
        },
      },
    },
    patch: {
      tags: ['Files'],
      summary: 'Update file info',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/UpdateFileRequest' } },
        },
      },
      responses: {
        '200': {
          description: 'File info updated successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/FileResponse' } },
          },
        },
      },
    },
    delete: {
      tags: ['Files'],
      summary: 'Delete file',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'File deleted successfully',
        },
      },
    },
  },
};
