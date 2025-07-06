import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from 'types/proto/auth';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthController } from './auth/auth.controller';
import { CINEMA_PACKAGE_NAME } from 'types/proto/cinema';
import { CinemaController } from './cinema/cinema.controller';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051',
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, 'proto/auth.proto'),
        },
      },
    ]),
    ClientsModule.register([
      {
        name: CINEMA_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50052',
          package: CINEMA_PACKAGE_NAME,
          protoPath: join(__dirname, 'proto/cinema.proto'),
        },
      },
    ]),
  ],
  controllers: [AppController, AuthController, CinemaController],
  providers: [AppService],
})
export class AppModule {}
