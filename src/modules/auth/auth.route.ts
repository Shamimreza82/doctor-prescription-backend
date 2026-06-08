import { Router } from 'express';

import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { Role } from '@/shared/constend/auth.const';

import { AuthControllers } from './auth.controller';
import { AuthValidationSchemas } from './auth.validation';

const router = Router();

router.post(
  '/register',
  auth(Role.SUPER_ADMIN),
  validateRequest(AuthValidationSchemas.registerSchema),
  AuthControllers.register,
);

router.post('/login', validateRequest(AuthValidationSchemas.loginSchema), AuthControllers.login);

router.post('/refresh-token', AuthControllers.refreshToken);

router.get('/me', auth(), AuthControllers.me);

export const authRoutes = router;
