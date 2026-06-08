export const rolePaths = {
  '/roles': {
    get: {
      tags: ['Roles'],
      summary: 'Get roles',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1, minimum: 1 } },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 10, minimum: 1, maximum: 100 },
        },
        { in: 'query', name: 'search', schema: { type: 'string' } },
        { in: 'query', name: 'sortBy', schema: { type: 'string' } },
        { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'] } },
        { in: 'query', name: 'fields', schema: { type: 'string' } },
        { in: 'query', name: 'include', schema: { type: 'string' } },
        { in: 'query', name: 'filters', schema: { type: 'string' } },
        { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' } },
        { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' } },
        { in: 'query', name: 'isActive', schema: { type: 'boolean' } },
        { in: 'query', name: 'cursor', schema: { type: 'string' } },
      ],
      responses: {
        '200': {
          description: 'Roles fetched successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StandardSuccessResponse' },
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
    post: {
      tags: ['Roles'],
      summary: 'Create role',
      description: 'Requires authentication and the `ROLE:CREATE` permission.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateRoleRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Role created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StandardSuccessResponse' },
            },
          },
        },
        '400': {
          description: 'Invalid input data',
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
        '403': {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/roles/{roleId}/permissions': {
    post: {
      tags: ['Roles'],
      summary: 'Assign permissions to a role',
      description:
        'Requires authentication. The current route does not apply a separate permission middleware.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'roleId',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AssignPermissionsRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Permissions assigned successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StandardSuccessResponse' },
            },
          },
        },
        '400': {
          description: 'Invalid input data',
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
  },
};
