import { schemas } from './openapi.register';
import { paths } from './openapi.registry';

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Doctor Prescription Backend API',
    version: '1.0.0',
    description:
      'API documentation for the currently mounted root, auth, onboarding, and patient endpoints.',
  },
  servers: [
    {
      url: 'http://localhost:4000/api/v1',
      description: 'Version 1 API',
    },
    {
      url: 'http://localhost:4000',
      description: 'Root server',
    },
  ],
  tags: [{ name: 'Health' }, { name: 'Auth' }, { name: 'Onboarding' }, { name: 'Patients' }],
  paths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas,
  },
} as const;
