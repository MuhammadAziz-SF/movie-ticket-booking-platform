import { Module } from '@nestjs/common';
import { CinemaController } from './cinema.controller';

@Module({
  controllers: [CinemaController],
})
export class CinemaModule {}
