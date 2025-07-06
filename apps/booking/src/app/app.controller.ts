import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { 
    BookingServiceController, 
    BookingServiceControllerMethods,
    CreateBookingRequest,
    CreateBookingResponse,
    GetBookingRequest,
    GetBookingResponse,
    UpdateBookingRequest,
    UpdateBookingResponse,
    DeleteBookingRequest,
    DeleteBookingResponse,
    ListBookingsRequest,
    ListBookingsResponse,
    FilterBookingsRequest,
    FilterBookingsResponse,
    CreatePaymentRequest,
    CreatePaymentResponse,
    GetPaymentRequest,
    GetPaymentResponse,
    UpdatePaymentRequest,
    UpdatePaymentResponse,
    DeletePaymentRequest,
    DeletePaymentResponse,
    ListPaymentsRequest,
    ListPaymentsResponse,
    FilterPaymentsRequest,
    FilterPaymentsResponse,
    CreateTicketRequest,
    CreateTicketResponse,
    GetTicketRequest,
    GetTicketResponse,
    UpdateTicketRequest,
    UpdateTicketResponse,
    DeleteTicketRequest,
    DeleteTicketResponse,
    ListTicketsRequest,
    ListTicketsResponse,
    FilterTicketsRequest,
    FilterTicketsResponse,
} from '@app/types/proto/booking';
import { Observable } from 'rxjs';

@Controller()
@BookingServiceControllerMethods()
export class AppController implements BookingServiceController {
  constructor(private readonly appService: AppService) {}

  // Booking RPCs
  createBooking(request: CreateBookingRequest): Promise<CreateBookingResponse> | Observable<CreateBookingResponse> | CreateBookingResponse {
    return this.appService.createBooking(request);
  }

  getBooking(request: GetBookingRequest): Promise<GetBookingResponse> | Observable<GetBookingResponse> | GetBookingResponse {
    return this.appService.getBooking(request);
  }

  updateBooking(request: UpdateBookingRequest): Promise<UpdateBookingResponse> | Observable<UpdateBookingResponse> | UpdateBookingResponse {
    return this.appService.updateBooking(request);
  }

  deleteBooking(request: DeleteBookingRequest): Promise<DeleteBookingResponse> | Observable<DeleteBookingResponse> | DeleteBookingResponse {
    return this.appService.deleteBooking(request);
  }

  listBookings(request: ListBookingsRequest): Promise<ListBookingsResponse> | Observable<ListBookingsResponse> | ListBookingsResponse {
    return this.appService.listBookings(request);
  }

  filterBookings(request: FilterBookingsRequest): Promise<FilterBookingsResponse> | Observable<FilterBookingsResponse> | FilterBookingsResponse {
    return this.appService.filterBookings(request);
  }

  // Payment RPCs
  createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> | Observable<CreatePaymentResponse> | CreatePaymentResponse {
    return this.appService.createPayment(request);
  }

  getPayment(request: GetPaymentRequest): Promise<GetPaymentResponse> | Observable<GetPaymentResponse> | GetPaymentResponse {
    return this.appService.getPayment(request);
  }

  updatePayment(request: UpdatePaymentRequest): Promise<UpdatePaymentResponse> | Observable<UpdatePaymentResponse> | UpdatePaymentResponse {
    return this.appService.updatePayment(request);
  }

  deletePayment(request: DeletePaymentRequest): Promise<DeletePaymentResponse> | Observable<DeletePaymentResponse> | DeletePaymentResponse {
    return this.appService.deletePayment(request);
  }

  listPayments(request: ListPaymentsRequest): Promise<ListPaymentsResponse> | Observable<ListPaymentsResponse> | ListPaymentsResponse {
    return this.appService.listPayments(request);
  }

  filterPayments(request: FilterPaymentsRequest): Promise<FilterPaymentsResponse> | Observable<FilterPaymentsResponse> | FilterPaymentsResponse {
    return this.appService.filterPayments(request);
  }

  // Ticket RPCs
  createTicket(request: CreateTicketRequest): Promise<CreateTicketResponse> | Observable<CreateTicketResponse> | CreateTicketResponse {
    return this.appService.createTicket(request);
  }

  getTicket(request: GetTicketRequest): Promise<GetTicketResponse> | Observable<GetTicketResponse> | GetTicketResponse {
    return this.appService.getTicket(request);
  }

  updateTicket(request: UpdateTicketRequest): Promise<UpdateTicketResponse> | Observable<UpdateTicketResponse> | UpdateTicketResponse {
    return this.appService.updateTicket(request);
  }

  deleteTicket(request: DeleteTicketRequest): Promise<DeleteTicketResponse> | Observable<DeleteTicketResponse> | DeleteTicketResponse {
    return this.appService.deleteTicket(request);
  }

  listTickets(request: ListTicketsRequest): Promise<ListTicketsResponse> | Observable<ListTicketsResponse> | ListTicketsResponse {
    return this.appService.listTickets(request);
  }

  filterTickets(request: FilterTicketsRequest): Promise<FilterTicketsResponse> | Observable<FilterTicketsResponse> | FilterTicketsResponse {
    return this.appService.filterTickets(request);
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}