export const authPaths = {
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      security: [{ bearerAuth: [] }],
      description: 'Creates a user account. This route is currently restricted to SUPER_ADMIN users.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRegisterResponse' },
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
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login user',
      description: 'Authenticates a user and sets the refresh token in an HTTP-only cookie.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'User logged in successfully',
          headers: {
            'Set-Cookie': {
              schema: {
                type: 'string',
              },
              description: 'HTTP-only refresh token cookie.',
            },
          },
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthLoginResponse' },
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
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
  '/auth/refresh-token': {
    post: {
      tags: ['Auth'],
      summary: 'Refresh access token',
      description: 'Reads the refresh token from the HTTP-only cookie named `refreshToken`.',
      responses: {
        '200': {
          description: 'Access token refreshed successfully',
          headers: {
            'Set-Cookie': {
              schema: {
                type: 'string',
              },
              description: 'Rotated HTTP-only refresh token cookie.',
            },
          },
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthRefreshResponse' },
            },
          },
        },
        '401': {
          description: 'Invalid refresh token',
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
