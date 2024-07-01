import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import {
  registerSchema,
  verifyAccountSchema,
  generateLoginOtpSchema,
  loginWithPasswordSchema,
  loginWithOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshSchema,
  logoutSchema,
} from '../utils/validators/auth';
import { validate } from '../utils/middlewares/validate';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post(
  '/verify-account',
  validate(verifyAccountSchema),
  AuthController.verifyAccount,
);
router.post(
  '/generate-login-otp',
  validate(generateLoginOtpSchema),
  AuthController.generateLoginOtp,
);
router.post(
  '/login-with-password',
  validate(loginWithPasswordSchema),
  AuthController.loginWithPassword,
);
router.post(
  '/login-with-otp',
  validate(loginWithOtpSchema),
  AuthController.loginWithOtp,
);
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  AuthController.forgotPassword,
);
router.patch(
  '/reset-password',
  validate(resetPasswordSchema),
  AuthController.resetPassword,
);
router.post('/refresh', validate(refreshSchema), AuthController.refreshToken);
router.post('/logout', validate(logoutSchema), AuthController.logout);

export default router;
