import { Router } from 'express';
import { AuthRoutes, OTPRoutes } from '../auth';
import { AppRoutes } from '../starter';
import { UserRoutes } from '../users';

const router = Router();

router.use('/', AppRoutes);
router.use('/users', UserRoutes);
router.use('/otp', OTPRoutes);
router.use('/auth', AuthRoutes);

export default router;
