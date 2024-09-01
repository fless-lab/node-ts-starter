import { Router } from 'express';

import { bruteForceMiddleware, validate } from '../../../common/shared';
import { AuthController } from '../controllers';
import {
  forgotPasswordSchema,
  generateLoginOtpSchema,
  loginWithOtpSchema,
  loginWithPasswordSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyAccountSchema,
} from '../validators';

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
  bruteForceMiddleware,
  AuthController.loginWithPassword,
);
router.post(
  '/login-with-otp',
  validate(loginWithOtpSchema),
  bruteForceMiddleware,
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
