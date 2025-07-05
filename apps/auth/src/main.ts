/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:50051',
      package: 'auth',
      protoPath: join(__dirname, 'proto/auth.proto'),
    }
  });
  await app.listen();
  Logger.log('🚀 Auth microservice is running on gRPC channel');
}

bootstrap();
