import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { JwtGuard } from "@app/common/guards/jwt.guard";
import { RolesGuard } from "@app/common/guards/roles.guard";
import { JwtService } from "@nestjs/jwt";

@Module({
    controllers: [BookingController],
    providers: [JwtGuard, RolesGuard, JwtService],
})
export class BookingModule {}