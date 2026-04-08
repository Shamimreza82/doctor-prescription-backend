import { Router } from 'express';

import { authRoutes } from '@/modules/auth/auth.route';
import { onboardingRouter } from '@/modules/onboarding/onboarding.router';
import { patientRoutes } from '@/modules/patient/patient.route';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
// apiRouter.use('/doctors', doctorRoutes);
apiRouter.use('/onboarding', onboardingRouter);
apiRouter.use('/patients', patientRoutes);








// apiRouter.use('/auth', authRoutes);
// apiRouter.use('/doctors', doctorRoutes);
// apiRouter.use('/patients', patientRoutes);
// apiRouter.use('/prescriptions', prescriptionRoutes);
// apiRouter.use('/plans', planRoutes);
// apiRouter.use('/subscriptions', subscriptionRoutes);
// apiRouter.use('/settings', settingRoutes);
// apiRouter.use('/dashboard', dashboardRoutes);
