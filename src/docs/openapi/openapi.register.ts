import { errorResponses } from './responses/error.response';
import { successResponses } from './responses/success.response';
import { authSchemas } from './schemas/auth.schema';
import { healthSchemas } from './schemas/health.schema';
import { onboardingSchemas } from './schemas/onboarding.schema';
import { patientSchemas } from './schemas/patient.schema';

export const schemas = {
  ...healthSchemas,
  ...authSchemas,
  ...onboardingSchemas,
  ...patientSchemas,
  ...successResponses,
  ...errorResponses,
};
