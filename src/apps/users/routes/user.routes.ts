import { Router } from 'express';
import {
  authenticateAndAttachUserContext,
  validate,
} from '../../../common/shared';
import { createUserSchema } from '../validators';
import { UserController } from '../controllers';
const router = Router();

router.post(
  '/',
  authenticateAndAttachUserContext,
  validate(createUserSchema),
  UserController.createUser,
);
router.get('/', UserController.getAllUsers);
router.get(
  '/current',
  authenticateAndAttachUserContext,
  UserController.getCurrentUser,
);
router.get('/:id', UserController.getUserById);

export default router;
