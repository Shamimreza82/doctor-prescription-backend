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

// Medical Profile Routes
router.get(
  '/:id/medical-profile',
  validateRequest(PatientValidationSchemas.patientParamsSchema),
  PatientControllers.getMedicalProfile,
);
router.patch(
  '/:id/medical-profile',
  validateRequest(PatientValidationSchemas.patientParamsSchema),
  validateRequest(PatientValidationSchemas.updateMedicalProfileSchema),
  PatientControllers.updateMedicalProfile,
);

// Visit Routes
router.post(
  '/:id/visits',
  validateRequest(PatientValidationSchemas.createVisitSchema),
  PatientControllers.createVisit,
);

router.get(
  '/:id/visits',
  validateRequest(PatientValidationSchemas.listVisitsSchema),
  PatientControllers.listVisits,
);

router.get(
  '/:id/visits/:visitId',
  validateRequest(PatientValidationSchemas.updateVisitSchema),
  PatientControllers.getVisitById,
);

router.patch(
  '/:id/visits/:visitId',
  validateRequest(PatientValidationSchemas.updateVisitSchema),
  PatientControllers.updateVisit,
);

// Visit Vitals Routes
router.get(
  '/:id/visits/:visitId/vitals',
  validateRequest(PatientValidationSchemas.visitVitalsSchema),
  PatientControllers.getVisitVitals,
);
router.post(
  '/:id/visits/:visitId/vitals',
  validateRequest(PatientValidationSchemas.visitVitalsSchema),
  PatientControllers.recordVisitVitals,
);

export const patientRoutes = router;
