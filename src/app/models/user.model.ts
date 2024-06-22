import { Schema, model } from 'mongoose';
import { IUserModel } from '../utils/types';

const UserSchema: Schema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'guest'], default: 'user' },
    profilePhoto: { type: String },
  },
  { timestamps: true },
);

const UserModel = model<IUserModel>('User', UserSchema);

export default UserModel;
