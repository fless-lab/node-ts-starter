import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import config from '../../../config';

class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.runningProd && config.mail.port === 465, // true for 465, false for other ports
      auth: config.runningProd
        ? {
            user: config.mail.user,
            pass: config.mail.pass,
          }
        : undefined,
    });
  }

  async sendMail({
    to,
    subject,
    text,
    htmlTemplate,
    templateData,
    fromName,
    fromEmail,
  }: {
    to: string;
    subject: string;
    text?: string;
    htmlTemplate?: string;
    templateData?: Record<string, any>;
    fromName?: string;
    fromEmail?: string;
  }): Promise<void> {
    try {
      let htmlContent;
      if (htmlTemplate) {
        const templatePath = path.join(
          __dirname,
          '../../templates/mail/',
          `${htmlTemplate}.html`,
        );
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(templateSource);
        htmlContent = template(templateData);
      }

      const mailOptions = {
        from: `"${fromName || config.mail.fromName}" <${fromEmail || config.mail.from}>`,
        to,
        subject,
        text,
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}

export default new MailService();
