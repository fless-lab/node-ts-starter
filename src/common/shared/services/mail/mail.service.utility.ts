import { config } from '../../../../core/config';
import { ErrorResponseType, SuccessResponseType } from '../../types';
import { ErrorResponse } from '../../utils';
import MailService from './mail.service';

class MailServiceUtilities {
  static async sendOtp({
    to,
    code,
    purpose,
  }: {
    to: string;
    code: string;
    purpose: string;
  }): Promise<SuccessResponseType<void> | ErrorResponseType> {
    const otpPurpose = config.otp.purposes[purpose];
    if (!otpPurpose) {
      return {
        success: false,
        error: new ErrorResponse('BAD_REQUEST', 'Invalid OTP purpose provided'),
      };
    }

    const subject = otpPurpose.title;
    const text = `${otpPurpose.message} ${code}\n\nThis code is valid for ${
      config.otp.expiration / 60000
    } minutes.`;

    return await MailService.sendMail({ to, subject, text });
  }

  static async sendAccountCreationEmail({
    to,
    firstname,
  }: {
    to: string;
    firstname: string;
  }): Promise<SuccessResponseType<void> | ErrorResponseType> {
    const subject = 'Welcome to Our Service';
    const htmlTemplate = 'welcome';
    const templateData = { firstname };

    return await MailService.sendMail({
      to,
      subject,
      htmlTemplate,
      templateData,
    });
  }
}

export default MailServiceUtilities;
