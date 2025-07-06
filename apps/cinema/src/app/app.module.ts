import { Module } from '@nestjs/common';
import { CinemaController } from './app.controller';
import { CinemaService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from '@app/common/prisma/prisma.module'

@Module({
  imports: [
    PrismaModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
      max: 10,
    }), 
  ],
  controllers: [CinemaController],
  providers: [CinemaService],
})
export class AppModule {}
