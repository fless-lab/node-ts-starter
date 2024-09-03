import { CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserModel } from '../types';
import { BaseModel, createBaseSchema } from '../../../core/engine';
import { config } from '../../../core/config';

const USER_MODEL_NAME = 'User';

const UserSchema = createBaseSchema<IUserModel>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'guest'], default: 'user' },
    profilePhoto: { type: String },
    active: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
  },
  {
    modelName: USER_MODEL_NAME,
  },
);

UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew || this.isModified('password')) {
      const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const UserModel = new BaseModel<IUserModel>(
  USER_MODEL_NAME,
  UserSchema,
).getModel();

export default UserModel;
