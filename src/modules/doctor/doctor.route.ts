import { Router } from 'express';

import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { Role } from '@/shared/constend/auth.const';

import { DoctorControllers } from './doctor.controller';
import { DoctorValidationSchemas } from './doctor.validation';

const router = Router();

// Public or Shared Routes
router.get('/', auth(Role.SUPER_ADMIN, Role.DOCTOR, Role.ASSISTANT), DoctorControllers.listDoctors);
router.get('/:id', auth(Role.SUPER_ADMIN, Role.DOCTOR, Role.ASSISTANT, Role.PATIENT), DoctorControllers.getDoctorById);

// Doctor Only Routes (Personal Profile Management)
router.get('/me/profile', auth(Role.DOCTOR), DoctorControllers.getMyProfile);
router.patch(
  '/me/profile',
  auth(Role.DOCTOR),
  validateRequest(DoctorValidationSchemas.updateDoctorProfileSchema),
  DoctorControllers.updateProfile,
);

// Chambers
router.post(
  '/me/chambers',
  auth(Role.DOCTOR),
  validateRequest(DoctorValidationSchemas.chamberSchema),
  DoctorControllers.addChamber,
);
router.get('/me/chambers', auth(Role.DOCTOR), DoctorControllers.getMyChambers);
router.patch(
  '/me/chambers/:id',
  auth(Role.DOCTOR),
  validateRequest(DoctorValidationSchemas.chamberSchema),
  DoctorControllers.updateChamber,
);
router.delete('/me/chambers/:id', auth(Role.DOCTOR), DoctorControllers.deleteChamber);

// Schedules
router.post(
  '/me/schedules',
  auth(Role.DOCTOR),
  validateRequest(DoctorValidationSchemas.scheduleSchema),
  DoctorControllers.addSchedule,
);
router.get('/me/schedules', auth(Role.DOCTOR), DoctorControllers.getMySchedules);
router.patch(
  '/me/schedules/:id',
  auth(Role.DOCTOR),
  validateRequest(DoctorValidationSchemas.scheduleSchema),
  DoctorControllers.updateSchedule,
);
router.delete('/me/schedules/:id', auth(Role.DOCTOR), DoctorControllers.deleteSchedule);

// Fees
router.post(
  '/me/fees',
  auth(Role.DOCTOR),
  validateRequest(DoctorValidationSchemas.feeConfigSchema),
  DoctorControllers.updateFeeConfig,
);
router.get('/me/fees', auth(Role.DOCTOR), DoctorControllers.getMyFees);
router.delete('/me/fees/:id', auth(Role.DOCTOR), DoctorControllers.deleteFeeConfig);

// Leaves
router.post(
  '/me/leaves',
  auth(Role.DOCTOR),
  validateRequest(DoctorValidationSchemas.leaveSchema),
  DoctorControllers.addLeave,
);
router.get('/me/leaves', auth(Role.DOCTOR), DoctorControllers.getMyLeaves);
router.patch(
  '/me/leaves/:id',
  auth(Role.DOCTOR),
  validateRequest(DoctorValidationSchemas.leaveSchema),
  DoctorControllers.updateLeave,
);
router.delete('/me/leaves/:id', auth(Role.DOCTOR), DoctorControllers.deleteLeave);

export const doctorRoutes = router;
