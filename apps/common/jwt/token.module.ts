import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './index';
import { config } from './../config/index';

@Module({
  imports: [
    JwtModule.register({
      secret: config.ACCESS_TOKEN_KEY,
      signOptions: { expiresIn: config.ACCESS_TOKEN_TIME },
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
