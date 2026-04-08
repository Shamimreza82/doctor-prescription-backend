import { Router } from 'express';

import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { Role } from '@/shared/constend/auth.const';

import { PatientControllers } from './patient.controller';
import { PatientValidationSchemas } from './patient.validation';

const router = Router();

router.use(auth(Role.DOCTOR, Role.ASSISTANT));

router.post(
  '/',
  validateRequest(PatientValidationSchemas.createPatientSchema),
  PatientControllers.createPatient,
);

router.get(
  '/',
  validateRequest(PatientValidationSchemas.listPatientsSchema),
  PatientControllers.listPatients,
);

router.get(
  '/:id',
  validateRequest(PatientValidationSchemas.patientParamsSchema),
  PatientControllers.getPatientById,
);

router.patch(
  '/:id',
  validateRequest(PatientValidationSchemas.patientParamsSchema),
  validateRequest(PatientValidationSchemas.updatePatientSchema),
  PatientControllers.updatePatient,
);

router.delete(
  '/:id',
  validateRequest(PatientValidationSchemas.patientParamsSchema),
  PatientControllers.archivePatient,
);

export const patientRoutes = router;
