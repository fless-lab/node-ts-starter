import { Document, Types } from 'mongoose';
import { config } from '../../../core/config';
import { IBaseModel } from '../../../core/engine';

export type TOTPPurpose = keyof typeof config.otp.purposes;

export interface IOTP {
  code: string;
  user: Types.ObjectId;
  used: boolean;
  isFresh: boolean;
  expiresAt: Date;
  purpose: TOTPPurpose;
  attempts?: number;
}

export interface IOTPModel extends IOTP, IBaseModel, Document {}
