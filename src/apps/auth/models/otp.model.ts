import { Schema, model } from 'mongoose';
import { IOTPModel } from '../types';
import { config } from '../../../core';

const otpSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    isFresh: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    purpose: {
      type: String,
      enum: Object.keys(config.otp.purposes),
      required: true,
    },
  },
  { timestamps: true },
);

const OTPModel = model<IOTPModel>('OTP', otpSchema);

export default OTPModel;
