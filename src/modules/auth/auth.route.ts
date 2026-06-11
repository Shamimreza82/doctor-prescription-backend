import { Router } from 'express';

import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';

import { AuthControllers } from './auth.controller';
import { AuthValidationSchemas } from './auth.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(AuthValidationSchemas.registerSchema),
  AuthControllers.register,
);

router.post('/login', validateRequest(AuthValidationSchemas.loginSchema), AuthControllers.login);
router.post('/refresh-token', AuthControllers.refreshToken);
router.post("/verify-email", AuthControllers.verifyEmail);
// router.post('/oauth/google', AuthController.googleAuth)
// router.post("/forgot-password", AuthController.forgotPassword);
// router.post("/reset-password", AuthController.resetPassword)
// router.post("/logout", AuthController.logout)
// router.post("/change-password", auth(AuthGard.USER), AuthController.changePassword)


router.get('/me', auth(), AuthControllers.me);

export const authRoutes = router;
