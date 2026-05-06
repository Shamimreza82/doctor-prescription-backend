import { Router } from 'express';

import { authRoutes } from '@/modules/auth/auth.route';
import { onboardingRouter } from '@/modules/onboarding/onboarding.router';
import { patientRoutes } from '@/modules/patient/patient.route';
import { prescriptionRoutes } from '@/modules/prescription/prescription.route';
import { uploadRouter } from '@/modules/upload/upload.router';
import { userRouter } from '@/modules/user/user.router';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/user', userRouter);
apiRouter.use('/onboarding', onboardingRouter);
apiRouter.use('/patients', patientRoutes);
apiRouter.use('/prescriptions', prescriptionRoutes);
apiRouter.use('/files', uploadRouter);








// apiRouter.use('/auth', authRoutes);
// apiRouter.use('/doctors', doctorRoutes);
// apiRouter.use('/patients', patientRoutes);
// apiRouter.use('/prescriptions', prescriptionRoutes);
// apiRouter.use('/plans', planRoutes);
// apiRouter.use('/subscriptions', subscriptionRoutes);
// apiRouter.use('/settings', settingRoutes);
// apiRouter.use('/dashboard', dashboardRoutes);
