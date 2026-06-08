export const doctorPaths = {
  '/doctors': {
    get: {
      tags: ['Doctors'],
      summary: 'List all doctors',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
      ],
      responses: {
        '200': {
          description: 'Doctors retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/DoctorListResponse' } },
          },
        },
      },
    },
  },
  '/doctors/{id}': {
    get: {
      tags: ['Doctors'],
      summary: 'Get doctor by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'Doctor retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/DoctorSingleResponse' } },
          },
        },
      },
    },
  },
  '/doctors/me/profile': {
    get: {
      tags: ['Doctors'],
      summary: 'Get my doctor profile',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Profile retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/DoctorSingleResponse' } },
          },
        },
      },
    },
    patch: {
      tags: ['Doctors'],
      summary: 'Update my doctor profile',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateDoctorProfileRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Profile updated successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/DoctorSingleResponse' } },
          },
        },
      },
    },
  },
  '/doctors/me/chambers': {
    get: {
      tags: ['Doctors'],
      summary: 'Get my chambers',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Chambers retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ChamberListResponse' } },
          },
        },
      },
    },
    post: {
      tags: ['Doctors'],
      summary: 'Add a chamber',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ChamberRequest' } },
        },
      },
      responses: {
        '201': {
          description: 'Chamber added successfully',
        },
      },
    },
  },
  '/doctors/me/chambers/{id}': {
    patch: {
      tags: ['Doctors'],
      summary: 'Update a chamber',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ChamberRequest' } },
        },
      },
      responses: {
        '200': {
          description: 'Chamber updated successfully',
        },
      },
    },
    delete: {
      tags: ['Doctors'],
      summary: 'Delete a chamber',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'Chamber deleted successfully',
        },
      },
    },
  },
  '/doctors/me/schedules': {
    get: {
      tags: ['Doctors'],
      summary: 'Get my schedules',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Schedules retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ScheduleListResponse' } },
          },
        },
      },
    },
    post: {
      tags: ['Doctors'],
      summary: 'Add a schedule',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ScheduleRequest' } },
        },
      },
      responses: {
        '201': {
          description: 'Schedule added successfully',
        },
      },
    },
  },
  '/doctors/me/schedules/{id}': {
    patch: {
      tags: ['Doctors'],
      summary: 'Update a schedule',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ScheduleRequest' } },
        },
      },
      responses: {
        '200': {
          description: 'Schedule updated successfully',
        },
      },
    },
    delete: {
      tags: ['Doctors'],
      summary: 'Delete a schedule',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'Schedule deleted successfully',
        },
      },
    },
  },
  '/doctors/me/fees': {
    get: {
      tags: ['Doctors'],
      summary: 'Get my fee configs',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Fee configs retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/FeeConfigListResponse' } },
          },
        },
      },
    },
    post: {
      tags: ['Doctors'],
      summary: 'Update fee config',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/FeeConfigRequest' } },
        },
      },
      responses: {
        '201': {
          description: 'Fee config updated successfully',
        },
      },
    },
  },
  '/doctors/me/fees/{id}': {
    delete: {
      tags: ['Doctors'],
      summary: 'Delete fee config',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'Fee config deleted successfully',
        },
      },
    },
  },
  '/doctors/me/leaves': {
    get: {
      tags: ['Doctors'],
      summary: 'Get my leaves',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Leaves retrieved successfully',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LeaveListResponse' } },
          },
        },
      },
    },
    post: {
      tags: ['Doctors'],
      summary: 'Add a leave',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/LeaveRequest' } },
        },
      },
      responses: {
        '201': {
          description: 'Leave added successfully',
        },
      },
    },
  },
  '/doctors/me/leaves/{id}': {
    patch: {
      tags: ['Doctors'],
      summary: 'Update a leave',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/LeaveRequest' } },
        },
      },
      responses: {
        '200': {
          description: 'Leave updated successfully',
        },
      },
    },
    delete: {
      tags: ['Doctors'],
      summary: 'Delete a leave',
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': {
          description: 'Leave deleted successfully',
        },
      },
    },
  },
};
