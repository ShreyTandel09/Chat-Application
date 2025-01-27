import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserConfirmation(email: string, token: string) {
    const url = `${this.configService.get<string>('FRONTEND_URL')}/auth/email-verify?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Chat App! Confirm your Email',
      template: './confirmation',
      context: {
        verifyUrl: url,
      },
    });
  }
}
