import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
