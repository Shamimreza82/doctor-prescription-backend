export const prescriptionPaths = {
  '/prescriptions': {
    post: {
      tags: ['Prescriptions'],
      summary: 'Create a prescription',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/CreatePrescriptionRequest' } },
        },
      },
      responses: {
        '201': {
          description: 'Prescription created successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PrescriptionSingleResponse' } },
          },
        },
      },
    },
    get: {
      tags: ['Prescriptions'],
      summary: 'List prescriptions',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
        { in: 'query', name: 'search', schema: { type: 'string' } },
        { in: 'query', name: 'status', schema: { $ref: '#/components/schemas/PrescriptionStatus' } },
        { in: 'query', name: 'patientId', schema: { type: 'string', format: 'uuid' } },
        { in: 'query', name: 'doctorId', schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'Prescriptions retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PrescriptionListResponse' } },
          },
        },
      },
    },
  },
  '/prescriptions/{id}': {
    get: {
      tags: ['Prescriptions'],
      summary: 'Get prescription by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'Prescription retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PrescriptionSingleResponse' } },
          },
        },
      },
    },
    patch: {
      tags: ['Prescriptions'],
      summary: 'Update prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/UpdatePrescriptionRequest' } },
        },
      },
      responses: {
        '200': {
          description: 'Prescription updated successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PrescriptionSingleResponse' } },
          },
        },
      },
    },
    delete: {
      tags: ['Prescriptions'],
      summary: 'Archive prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'Prescription archived successfully',
        },
      },
    },
  },
  '/prescriptions/{id}/generate-pdf': {
    post: {
      tags: ['Prescriptions'],
      summary: 'Generate PDF for prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'PDF generated successfully',
        },
      },
    },
  },
  '/prescriptions/{id}/download-pdf': {
    get: {
      tags: ['Prescriptions'],
      summary: 'Download PDF for prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'PDF file content',
          content: {
            'application/pdf': {
              schema: { type: 'string', format: 'binary' },
            },
          },
        },
      },
    },
  },
  '/prescriptions/{id}/view-pdf': {
    get: {
      tags: ['Prescriptions'],
      summary: 'View PDF for prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'PDF file content',
          content: {
            'application/pdf': {
              schema: { type: 'string', format: 'binary' },
            },
          },
        },
      },
    },
  },
};
