import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.post('/verify-account', AuthController.verifyAccount);
router.post('/login', AuthController.loginWithPassword);
router.post('/generate-login-otp', AuthController.generateLoginOtp);
router.post('/login-with-otp', AuthController.loginWithOtp);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.patch('/reset-password', AuthController.resetPassword);

export default router;
