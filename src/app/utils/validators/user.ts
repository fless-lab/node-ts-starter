import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('admin', 'user', 'guest').optional(),
  profilePhoto: Joi.string().optional(),
});
