import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer/index'
import { config } from '../../config/index';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config.SMPT_HOST,
        secure: false,
        auth: {
          user: config.SMPT_USER,
          pass: config.SMPT_PASS,
        },
      },
      defaults: {
        from: config.SMPT_USER,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
