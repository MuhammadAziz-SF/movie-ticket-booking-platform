/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { BOOKING_PACKAGE_NAME } from 'types/proto/booking';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:50053',
      package: BOOKING_PACKAGE_NAME,
      protoPath: join(__dirname, 'assets/proto/booking.proto'),
      loader: {
        includeDirs: [join(__dirname, 'assets/proto')],
      },
    }
  });
  await app.listen();
  Logger.log('🚀 Booking microservice is running on gRPC channel');
}

bootstrap();
