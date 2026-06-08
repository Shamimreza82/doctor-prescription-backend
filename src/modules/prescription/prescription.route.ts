import { Router } from 'express';

import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { Role } from '@/shared/constend/auth.const';

import { PrescriptionControllers } from './prescription.controller';
import { PrescriptionValidationSchemas } from './prescription.validation';

const router = Router();

router.use(auth(Role.DOCTOR, Role.ASSISTANT));

router.post(
  '/',
  validateRequest(PrescriptionValidationSchemas.createPrescriptionSchema),
  PrescriptionControllers.createPrescription,
);

router.get(
  '/',
  validateRequest(PrescriptionValidationSchemas.listPrescriptionsSchema),
  PrescriptionControllers.listPrescriptions,
);

router.get(
  '/:id',
  validateRequest(PrescriptionValidationSchemas.prescriptionParamsSchema),
  PrescriptionControllers.getPrescriptionById,
);

router.patch(
  '/:id',
  validateRequest(PrescriptionValidationSchemas.prescriptionParamsSchema),
  validateRequest(PrescriptionValidationSchemas.updatePrescriptionSchema),
  PrescriptionControllers.updatePrescription,
);

router.delete(
  '/:id',
  validateRequest(PrescriptionValidationSchemas.prescriptionParamsSchema),
  PrescriptionControllers.archivePrescription,
);

////// pdf routes ////////
router.post('/:id/generate-pdf', PrescriptionControllers.generatePdfPrescription);

router.get('/:id/download-pdf', PrescriptionControllers.downloadPdfPrescription);

router.get('/:id/view-pdf', PrescriptionControllers.viewPdfPrescription);

export const prescriptionRoutes = router;
