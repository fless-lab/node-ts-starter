import { Schema, model, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserModel } from '../types';
import { config } from '../../../core/config';

const UserSchema: Schema = new Schema(
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
  { timestamps: true },
);

// Pre-hook for hashing the password before saving
UserSchema.pre('save', async function (next) {
  try {
    if (this.isNew || this.isModified('password')) {
      const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
      const hashedPassword = await bcrypt.hash(this.password as string, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const UserModel = model<IUserModel>('User', UserSchema);

export default UserModel;
