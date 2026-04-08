export const authSchemas = {
  RegisterRequest: {
    type: 'object',
    required: ['name', 'email', 'phone', 'password'],
    properties: {
      name: { type: 'string', minLength: 2, example: 'John Doe' },
      email: { type: 'string', format: 'email', example: 'john@example.com' },
      phone: { type: 'string', example: '+8801712345678' },
      password: { type: 'string', minLength: 6, example: 'secret123' },
      publicId: { type: 'string', example: 'usr_public_123' },
      roleId: { type: 'string', format: 'uuid' },
      tenantId: { type: 'string', format: 'uuid' },
    },
  },
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'john@example.com' },
      password: { type: 'string', minLength: 6, example: 'secret123' },
    },
  },
  AuthRegisterResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Register successful' },
      data: {
        type: 'object',
        nullable: true,
        additionalProperties: true,
      },
      meta: { type: 'object', nullable: true, additionalProperties: true },
    },
  },
  AuthLoginResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Login successful' },
      data: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'jwt-access-token' },
          user: { $ref: '#/components/schemas/AuthUser' },
        },
      },
      meta: { type: 'object', nullable: true, additionalProperties: true },
    },
  },
  AuthRefreshResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Access token refreshed successfully' },
      data: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'jwt-access-token' },
        },
      },
      meta: { type: 'object', nullable: true, additionalProperties: true },
    },
  },
  AuthUser: {
    type: 'object',
    nullable: true,
    additionalProperties: true,
    properties: {
      id: { type: 'string', format: 'uuid', example: '9be8ec9b-39fe-43e6-bf7b-7ce16bdcb9e5' },
      name: { type: 'string', example: 'John Doe' },
      email: { type: 'string', format: 'email', example: 'john@example.com' },
      phone: { type: 'string', example: '+8801712345678' },
      role: { type: 'string', example: 'DOCTOR' },
      tenantId: { type: 'string', format: 'uuid', nullable: true },
    },
  },
};
