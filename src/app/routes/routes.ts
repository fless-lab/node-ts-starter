import { Router } from 'express';
import userRouter from './user.routes';
import appRoutes from './app.routes';

const router = Router();

router.use('/', appRoutes);
router.use('/users', userRouter);

export default router;
