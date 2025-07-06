import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@app/types/proto/auth';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthController } from './auth/auth.controller';
import { CINEMA_PACKAGE_NAME } from '@app/types/proto/cinema';
import { CinemaController } from './cinema/cinema.controller';
import { BookingController } from './booking/booking.controller';
import { BOOKING_PACKAGE_NAME } from '@app/types/proto/booking';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051',
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, 'assets/proto/auth.proto'),
          loader: {
            includeDirs: [join(__dirname, 'assets/proto')],
          },
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
          protoPath: join(__dirname, 'assets/proto/cinema.proto'),
          loader: {
            includeDirs: [join(__dirname, 'assets/proto')],
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: BOOKING_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50053',
          package: BOOKING_PACKAGE_NAME,
          protoPath: join(__dirname, 'assets/proto/booking.proto'),
          loader: {
            includeDirs: [join(__dirname, 'assets/proto')],
          },
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    CinemaController,
    BookingController,
  ],
  providers: [AppService, JwtService],
})
export class AppModule {}
