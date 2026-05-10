import { Router } from 'express';
import { auth } from '@/middlewares/auth';
import { UserControllers } from './user.controller';
import { Role } from '@/shared/constend/auth.const';

const router = Router();

router.get('/me', auth(...Object.values(Role)), UserControllers.getMyProfile);
router.patch('/me', auth(...Object.values(Role)), UserControllers.updateMyProfile);

export const userRouter = router;
