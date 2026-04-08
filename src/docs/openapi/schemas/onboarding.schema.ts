export const onboardingSchemas = {
  OnboardingDoctorRequest: {
    type: 'object',
    required: ['name', 'email', 'phone', 'password', 'planCode'],
    properties: {
      name: { type: 'string', minLength: 2, example: 'Dr. Ahmed Rahman' },
      email: { type: 'string', format: 'email', example: 'doctor@example.com' },
      phone: { type: 'string', example: '+8801712345678' },
      password: { type: 'string', minLength: 6, example: 'secret123' },
      planCode: { type: 'string', example: 'TRIAL' },
    },
  },
  OnboardingDoctorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Doctor register successful' },
      data: { type: 'boolean', example: true },
      meta: { type: 'object', nullable: true, additionalProperties: true },
    },
  },
};
