import { schemas } from './openapi.register';
import { authPaths } from './paths/auth.paths';
import { healthPaths } from './paths/health.schema';
import { onboardingPaths } from './paths/onboarding.paths';
import { patientPaths } from './paths/patient.paths';

export { schemas };

export const paths = {
  ...healthPaths,
  ...authPaths,
  ...onboardingPaths,
  ...patientPaths,
};
