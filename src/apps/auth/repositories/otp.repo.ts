import { Model } from 'mongoose';
import { config } from '../../../core/config';
import { IOTPModel, TOTPPurpose } from '../types';
import { generateRandomOTP } from '../../../helpers';
import { BaseRepository } from '../../../core/engine';

class OTPRepository extends BaseRepository<IOTPModel> {
  constructor(model: Model<IOTPModel>) {
    super(model);
  }

  async generateCode(user: string, purpose: TOTPPurpose): Promise<IOTPModel> {
    await this.invalidateOldCodes(user, purpose);
    const otp = new this.model({
      code: generateRandomOTP(config.otp.length),
      expiresAt: new Date(Date.now() + config.otp.expiration),
      user,
      purpose,
    });
    return await otp.save();
  }

  async markAsUsed(otpId: string): Promise<IOTPModel | null> {
    return await this.model
      .findByIdAndUpdate(otpId, { used: true }, { new: true })
      .exec();
  }

  async isExpired(otp: IOTPModel): Promise<boolean> {
    return otp.expiresAt ? Date.now() > otp.expiresAt.getTime() : true;
  }

  async isValid(code: string): Promise<boolean> {
    const otp = await this.findOne({ code, isFresh: true, used: false });
    return otp ? Date.now() <= otp.expiresAt.getTime() : false;
  }

  async findValidCodeByUser(
    code: string,
    user: string,
    purpose: TOTPPurpose,
  ): Promise<IOTPModel | null> {
    return await this.findOne({
      code,
      user,
      isFresh: true,
      used: false,
      purpose,
    });
  }

  async invalidateOldCodes(user: string, purpose: TOTPPurpose): Promise<void> {
    await this.model
      .updateMany({ user, used: false, purpose }, { $set: { isFresh: false } })
      .exec();
  }
}

export default OTPRepository;
