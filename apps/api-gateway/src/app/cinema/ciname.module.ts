import { Module } from '@nestjs/common';
import { CinemaController } from './cinema.controller';
import { JwtGuard } from '@app/common/guards/jwt.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CinemaController, JwtGuard, RolesGuard],
  providers: [JwtGuard, RolesGuard, JwtService],
})
export class CinemaModule {}  
