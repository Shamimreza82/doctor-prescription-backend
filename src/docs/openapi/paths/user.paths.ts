export const userPaths = {
  '/user/me': {
    get: {
      tags: ['User'],
      summary: 'Get current user profile',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'User profile retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } },
          },
        },
      },
    },
    patch: {
      tags: ['User'],
      summary: 'Update current user profile',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } },
        },
      },
      responses: {
        '200': {
          description: 'User profile updated successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } },
          },
        },
      },
    },
  },
};
