import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtGuard } from '@app/common/guards/jwt.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtGuard, RolesGuard],
  controllers: [AuthController],
  providers: [JwtService, JwtGuard, RolesGuard],
})
export class AuthModule {}
