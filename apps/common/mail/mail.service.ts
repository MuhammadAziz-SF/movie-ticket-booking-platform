import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendOtp(email: string, otp: number) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Your OTP for login',
      text: String(otp),
    });
  }
}
