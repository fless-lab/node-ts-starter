import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { validate } from '../utils/middlewares/validate';
import { createUserSchema } from '../utils/validators/user';

const router = Router();

router.post('/', validate(createUserSchema), UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

export default router;
