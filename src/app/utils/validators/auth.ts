import Joi from 'joi';

export const registerSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  profilePhoto: Joi.string().optional(),
}).unknown(false);

export const verifyAccountSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
}).unknown(false);

export const generateLoginOtpSchema = Joi.object({
  email: Joi.string().email().required(),
}).unknown(false);

export const loginWithPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(false);

export const loginWithOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
}).unknown(false);

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
}).unknown(false);

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
}).unknown(false);

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
}).unknown(false);

export const logoutSchema = Joi.object({
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
}).unknown(false);
