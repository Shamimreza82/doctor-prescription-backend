export const patientPaths = {
  '/patients': {
    post: {
      tags: ['Patients'],
      summary: 'Create a patient',
      description: 'Creates a patient for the authenticated doctor or assistant tenant scope.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreatePatientRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Patient created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatientSingleResponse' },
            },
          },
        },
        '400': {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    get: {
      tags: ['Patients'],
      summary: 'List patients',
      description: 'Returns a paginated list of patients for the authenticated doctor or assistant tenant scope.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', minimum: 1, default: 1 },
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        },
        {
          in: 'query',
          name: 'search',
          schema: { type: 'string' },
        },
        {
          in: 'query',
          name: 'sortBy',
          schema: { type: 'string', enum: ['createdAt', 'name'], default: 'createdAt' },
        },
        {
          in: 'query',
          name: 'sortOrder',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
        },
        {
          in: 'query',
          name: 'gender',
          schema: { $ref: '#/components/schemas/Gender' },
        },
        {
          in: 'query',
          name: 'status',
          schema: { $ref: '#/components/schemas/PatientStatus' },
        },
        {
          in: 'query',
          name: 'isActive',
          schema: { type: 'boolean' },
        },
      ],
      responses: {
        '200': {
          description: 'Patients retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatientListResponse' },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/patients/{id}': {
    get: {
      tags: ['Patients'],
      summary: 'Get patient by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      responses: {
        '200': {
          description: 'Patient retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatientSingleResponse' },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '404': {
          description: 'Patient not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    patch: {
      tags: ['Patients'],
      summary: 'Update patient',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdatePatientRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Patient updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatientSingleResponse' },
            },
          },
        },
        '400': {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '404': {
          description: 'Patient not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Patients'],
      summary: 'Archive patient',
      description: 'Soft deletes a patient by setting `deletedAt`, `isActive`, and `status`.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      responses: {
        '200': {
          description: 'Patient archived successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PatientSingleResponse' },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '404': {
          description: 'Patient not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
};
