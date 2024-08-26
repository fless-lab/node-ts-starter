import { Router } from 'express';
import { AppRoutes, AuthRoutes, OTPRoutes, UserRoutes } from '../../apps';

const router = Router();

router.use('/', AppRoutes);
router.use('/users', UserRoutes);
router.use('/otp', OTPRoutes);
router.use('/auth', AuthRoutes);

export default router;
