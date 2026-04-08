export const onboardingPaths = {
  '/onboarding/doctors': {
    post: {
      tags: ['Onboarding'],
      summary: 'Create a doctor workspace and doctor account',
      description:
        'Creates a tenant workspace, doctor user, tenant settings, and trial subscription. This route is currently restricted to SUPER_ADMIN users.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/OnboardingDoctorRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Doctor onboarding completed successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OnboardingDoctorResponse' },
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
          description: 'Plan not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '409': {
          description: 'Doctor already exists',
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
