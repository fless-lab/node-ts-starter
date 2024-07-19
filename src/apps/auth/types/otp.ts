import { Document } from 'mongoose';
import config from '../../../config';

export type TOTPPurpose = keyof typeof config.otp.purposes;

export interface IOTP {
  code: string;
  user: string;
  used: boolean;
  isFresh: boolean;
  expiresAt: Date;
  purpose: TOTPPurpose;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOTPModel extends IOTP, Document {}
