import { generateRandomOTP } from '../../../helpers';
import {
  ErrorResponse,
  ErrorResponseType,
  MailServiceUtilities,
  SuccessResponseType,
} from '../../../common/shared';
import { IUserModel, UserService } from '../../users';
import { OTPModel } from '../models';
import { IOTPModel, TOTPPurpose } from '../types';
import { config } from '../../../core/config';
import { BaseService } from '../../../core/engine';
import { OTPRepository } from '../repositories';

class OTPService extends BaseService<IOTPModel, OTPRepository> {
  constructor() {
    const otpRepo = new OTPRepository(OTPModel);
    super(otpRepo, false);
  }

  async generate(
    email: string,
    purpose: TOTPPurpose,
  ): Promise<SuccessResponseType<IOTPModel> | ErrorResponseType> {
    try {
      const userResponse = (await UserService.findOne({
        email,
      })) as SuccessResponseType<IUserModel>;
      if (!userResponse.success || !userResponse.document) {
        // TODO: Customize this kind of error to override BaseService generic not found
        throw userResponse.error;
      }

      const user = userResponse.document;
      await this.repository.invalidateOldCodes(user.id, purpose);

      const otp = await this.repository.create({
        code: generateRandomOTP(config.otp.length),
        expiresAt: new Date(Date.now() + config.otp.expiration),
        user: user.id,
        purpose,
      });

      const mailResponse = await MailServiceUtilities.sendOtp({
        to: user.email,
        code: otp.code,
        purpose,
      });

      if (!mailResponse.success) {
        throw mailResponse.error;
      }

      return { success: true, document: otp };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                (error as Error).message,
              ),
      };
    }
  }

  async validate(
    email: string,
    code: string,
    purpose: TOTPPurpose,
  ): Promise<SuccessResponseType<null> | ErrorResponseType> {
    try {
      const userResponse = (await UserService.findOne({
        email,
      })) as SuccessResponseType<IUserModel>;
      if (!userResponse.success || !userResponse.document) {
        throw new ErrorResponse('NOT_FOUND_ERROR', 'User not found.');
      }

      const user = userResponse.document;
      const otpResponse = await this.repository.findValidCodeByUser(
        code,
        user.id,
        purpose,
      );

      const invalidOtpError = new ErrorResponse(
        'UNAUTHORIZED',
        'This OTP code is invalid or has expired.',
      );

      if (!otpResponse) {
        throw invalidOtpError;
      }

      const otp = otpResponse;
      if (await this.repository.isExpired(otp)) {
        throw invalidOtpError;
      }

      await this.repository.markAsUsed(otp.id);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse(
                'INTERNAL_SERVER_ERROR',
                (error as Error).message,
              ),
      };
    }
  }
}

export default new OTPService();
