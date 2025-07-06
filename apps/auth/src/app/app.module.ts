import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/common/prisma/prisma.module';
import { AuthController } from './app.controller';
import { AuthService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { MailModule } from '@app/common/mail/mail.module';
import { TokenModule } from '@app/common/jwt/token.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
      max: 10,
    }),
    MailModule,
    TokenModule,  
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], 
})
export class AppModule {}