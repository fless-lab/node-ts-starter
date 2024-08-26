import { Router } from 'express';
import { createUserSchema } from '../validators';
import { UserController } from '../controllers';
import { authenticateRequest, validate } from '../../../common';
const router = Router();

router.post('/', validate(createUserSchema), UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/current', authenticateRequest, UserController.getCurrentUser);
router.get('/:id', UserController.getUserById);

export default router;
