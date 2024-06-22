import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { validate } from '../utils/middlewares/validate';
import { createUserSchema } from '../utils/validators/user';

const userRouter = Router();

userRouter.post('/', validate(createUserSchema), (req, res, next) =>
  UserController.createUser(req, res, next),
);
userRouter.get('/', (req, res, next) =>
  UserController.getAllUsers(req, res, next),
);

export default userRouter;
