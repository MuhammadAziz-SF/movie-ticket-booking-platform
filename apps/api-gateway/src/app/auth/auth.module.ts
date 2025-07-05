import { Transport } from "@nestjs/microservices";
import { AUTH_PACKAGE_NAME } from "types/proto/auth";
import { Module } from '@nestjs/common'
import { ClientsModule } from "@nestjs/microservices";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50051', 
          package: AUTH_PACKAGE_NAME, 
          protoPath: 'proto/auth.proto', 
        },
      },
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}