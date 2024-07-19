import { Document } from 'mongoose';

export type TUserRole = 'admin' | 'user' | 'guest';

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: TUserRole;
  profilePhoto?: string;
  verified: boolean;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserModel extends IUser, Document {}
