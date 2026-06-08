import { schemas } from './openapi.register';
import { authPaths } from './paths/auth.paths';
import { doctorPaths } from './paths/doctor.paths';
import { healthPaths } from './paths/health.schema';
import { onboardingPaths } from './paths/onboarding.paths';
import { patientPaths } from './paths/patient.paths';
import { prescriptionPaths } from './paths/prescription.paths';
import { uploadPaths } from './paths/upload.paths';
import { userPaths } from './paths/user.paths';

export { schemas };

export const paths = {
  ...healthPaths,
  ...authPaths,
  ...onboardingPaths,
  ...patientPaths,
  ...doctorPaths,
  ...prescriptionPaths,
  ...userPaths,
  ...uploadPaths,
};
