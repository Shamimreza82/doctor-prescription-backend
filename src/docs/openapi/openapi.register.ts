import { errorResponses } from './responses/error.response';
import { successResponses } from './responses/success.response';
import { authSchemas } from './schemas/auth.schema';
import { doctorSchemas } from './schemas/doctor.schema';
import { healthSchemas } from './schemas/health.schema';
import { onboardingSchemas } from './schemas/onboarding.schema';
import { patientSchemas } from './schemas/patient.schema';
import { prescriptionSchemas } from './schemas/prescription.schema';
import { uploadSchemas } from './schemas/upload.schema';
import { userSchemas } from './schemas/user.schema';

export const schemas = {
  ...healthSchemas,
  ...authSchemas,
  ...onboardingSchemas,
  ...patientSchemas,
  ...doctorSchemas,
  ...prescriptionSchemas,
  ...userSchemas,
  ...uploadSchemas,
  ...successResponses,
  ...errorResponses,
};
