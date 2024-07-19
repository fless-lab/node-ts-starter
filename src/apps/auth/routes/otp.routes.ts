import { Router } from 'express';
import { OTPController } from '../controllers';

const router = Router();

router.post('/generate', OTPController.generateOTP);
router.post('/validate', OTPController.validateOTP);

export default router;
