import { Router } from 'express';
import userRouter from './user.routes';
import appRoutes from './app.routes';
import otpRoutes from './otp.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/', appRoutes);
router.use('/users', userRouter);
router.use('/otp', otpRoutes);
router.use('/auth', authRoutes);

export default router;
