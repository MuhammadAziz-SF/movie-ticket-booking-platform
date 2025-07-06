import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
  OnModuleInit,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  BOOKING_PACKAGE_NAME,
  BOOKING_SERVICE_NAME,
  BookingServiceController,
  CreateBookingRequest,
  UpdateBookingRequest,
  ListBookingsRequest,
  FilterBookingsRequest,
  CreateTicketRequest,
  UpdateTicketRequest,
  ListTicketsRequest,
  FilterTicketsRequest,
} from '@app/types/proto/booking';
import { JwtGuard } from '@app/common/guards/jwt.guard';
import { RolesGuard } from '@app/common/guards/roles.guard';
import { Roles } from '@app/common/decorators/roles.decorator';

@Controller('booking')
@UseGuards(JwtGuard) 
export class BookingController implements OnModuleInit {
  private bookingService: BookingServiceController;

  constructor(@Inject(BOOKING_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.bookingService =
      this.client.getService<BookingServiceController>(BOOKING_SERVICE_NAME);
  }

  @Post('bookings')
  @HttpCode(HttpStatus.CREATED)
  createBooking(@Body() body: CreateBookingRequest) {
    return this.bookingService.createBooking(body);
  }

  @Post('bookings/list')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin') 
  @HttpCode(HttpStatus.OK)
  listBookings(@Body() body: ListBookingsRequest) {
    return this.bookingService.listBookings(body);
  }

  @Post('bookings/filter')
  @HttpCode(HttpStatus.OK)
  filterBookings(@Body() body: FilterBookingsRequest) {
    return this.bookingService.filterBookings(body);
  }

  @Get('bookings/:id')
  getBooking(@Param('id') id: string) {
    return this.bookingService.getBooking({ id });
  }

  @Patch('bookings/:id')
  updateBooking(
    @Param('id') id: string,
    @Body() body: Omit<UpdateBookingRequest, 'id'>,
  ) {
    return this.bookingService.updateBooking({ id, ...body });
  }

  @Delete('bookings/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin') 
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking({ id });
  }

  @Post('tickets')
  @HttpCode(HttpStatus.CREATED)
  createTicket(@Body() body: CreateTicketRequest) {
    return this.bookingService.createTicket(body);
  }

  @Post('tickets/list')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  listTickets(@Body() body: ListTicketsRequest) {
    return this.bookingService.listTickets(body);
  }

  @Post('tickets/filter')
  @HttpCode(HttpStatus.OK)
  filterTickets(@Body() body: FilterTicketsRequest) {
  
    return this.bookingService.filterTickets(body);
  }

  @Get('tickets/:id')
  getTicket(@Param('id') id: string) {

    return this.bookingService.getTicket({ id });
  }

  @Patch('tickets/:id')
  updateTicket(
    @Param('id') id: string,
    @Body() body: Omit<UpdateTicketRequest, 'id'>,
  ) {
    return this.bookingService.updateTicket({ id, ...body });
  }

  @Delete('tickets/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin') 
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTicket(@Param('id') id: string) {
    return this.bookingService.deleteTicket({ id });
  }
}