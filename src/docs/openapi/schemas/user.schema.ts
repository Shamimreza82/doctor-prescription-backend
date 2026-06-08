export const userSchemas = {
  UserStatus: {
    type: 'string',
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'LOCKED'],
  },
  Role: {
    type: 'string',
    enum: ['SUPER_ADMIN', 'MR', 'DOCTOR', 'ASSISTANT', 'PATIENT'],
  },
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      publicId: { type: 'string', nullable: true },
      tenantId: { type: 'string', format: 'uuid', nullable: true },
      role: { $ref: '#/components/schemas/Role' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string', nullable: true },
      status: { $ref: '#/components/schemas/UserStatus' },
      emailVerified: { type: 'boolean' },
      phoneVerified: { type: 'boolean' },
      lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  UpdateUserRequest: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      phone: { type: 'string' },
      photoUrl: { type: 'string', format: 'uri' },
    },
  },
  UserResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      data: { $ref: '#/components/schemas/User' },
    },
  },
};
