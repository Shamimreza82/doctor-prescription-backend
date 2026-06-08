import express from 'express';

import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { Role } from '@/shared/constend/auth.const';

import { OnboardingControllers } from './onboarding.controller';
import { OnboardingValidationSchemas } from './onboarding.validation';

const router = express.Router();

router.post(
  '/doctors',
  auth(Role.SUPER_ADMIN, Role.MR),
  validateRequest(OnboardingValidationSchemas.onboardingRegisterSchema),
  OnboardingControllers.createDoctor,
);

export const onboardingRouter = router;
