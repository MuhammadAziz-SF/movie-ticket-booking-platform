import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service'; 
import {
  CreateBookingRequest,
  CreateBookingResponse,
  CreatePaymentRequest,

  CreatePaymentResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  DeleteBookingRequest,
  DeleteBookingResponse,
  DeletePaymentRequest,
  DeletePaymentResponse,
  DeleteTicketRequest,
  DeleteTicketResponse,
  FilterBookingsRequest,
  FilterBookingsResponse,
  FilterPaymentsRequest,
  FilterPaymentsResponse,
  FilterTicketsRequest,
  FilterTicketsResponse,
  GetBookingRequest,
  GetBookingResponse,
  GetPaymentRequest,
  GetPaymentResponse,
  GetTicketRequest,
  GetTicketResponse,
  ListBookingsRequest,
  ListBookingsResponse,
  ListPaymentsRequest,
  ListPaymentsResponse,
  ListTicketsRequest,
  ListTicketsResponse,
  UpdateBookingRequest,
  UpdateBookingResponse,
  UpdatePaymentRequest,
  UpdatePaymentResponse,
  UpdateTicketRequest,
  UpdateTicketResponse,
} from '@app/types/proto/booking'; 
import { catchError } from '@app/common/helper/catch.error'; 

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

 async createBooking(req: CreateBookingRequest): Promise<CreateBookingResponse> {
  try {
    const { userId, showtimeId, totalAmount, expiresAt, seatsId } = req;
    
    if(!userId || !showtimeId || !totalAmount || !expiresAt || !seatsId) {
      throw new BadRequestException('Missing required fields');
    }

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        showtimeId,
        totalAmount,
        expiresAt,
        seatsId,
      },
      include: { tickets: true, payments: true },
    });

    return { booking };
  } catch (error) {
      return catchError(error);
  }
}

  async getBooking(req: GetBookingRequest): Promise<GetBookingResponse> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id: req.id },
        include: { tickets: true, payments: true },
      });
      
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${req.id} not found`);
      }

      return { 
        booking: booking 
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async updateBooking(req: UpdateBookingRequest): Promise<UpdateBookingResponse> {
    try {
      const { id, ...data } = req;
      const updateData: Prisma.BookingUpdateInput = {};
      
      if (data.status) updateData.status = data.status as any;
      if (data.totalAmount) updateData.totalAmount = data.totalAmount;
      if (data.expiresAt) updateData.expiresAt = new Date(data.expiresAt);
      
      const booking = await this.prisma.booking.update({
        where: { id },
        data: updateData,
        include: { tickets: true, payments: true },
      });
      return { booking: booking };
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteBooking(req: DeleteBookingRequest): Promise<DeleteBookingResponse> {
    try {
      await this.prisma.booking.delete({ where: { id: req.id } });
      return { result: { success: true, message: 'Booking deleted successfully' } };
    } catch (error) {
      return catchError(error);
    }
  }

  async listBookings(req: ListBookingsRequest): Promise<ListBookingsResponse> {
    try {
      const { pagination } = req;
      const [bookings, total] = await Promise.all([
        this.prisma.booking.findMany({
          skip: (pagination?.page - 1) * pagination?.limit,
          take: pagination?.limit,
          include: { tickets: true, payments: true },
        }),
        this.prisma.booking.count(),
      ]);

      return { 
        bookings: bookings, 
        total 
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async filterBookings(req: FilterBookingsRequest): Promise<FilterBookingsResponse> {
    try {
      const { filter, pagination } = req;
      const where: Prisma.BookingWhereInput = {};

      if (filter?.userId) where.userId = filter.userId;
      if (filter?.status) where.status = filter.status as any; // Cast to any to handle enum mapping
      if (filter?.showtimeId) where.showtimeId = filter.showtimeId;

      const [bookings, total] = await Promise.all([
        this.prisma.booking.findMany({
          where,
          skip: (pagination?.page - 1) * pagination?.limit,
          take: pagination?.limit,
          include: { tickets: true, payments: true },
        }),
        this.prisma.booking.count({ where }),
      ]);

      return { 
        bookings: bookings, 
        total 
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async createPayment(req: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      const { payment: paymentData } = req;
      const payment = await this.prisma.payment.create({
        data: {
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          transactionId: paymentData.transactionId,
          status: paymentData.status as any,
          bookingId: paymentData.bookingId,
        },
        include: { booking: true },
      });
      return { payment };
    } catch (error) {
      return catchError(error);
    }
  }

  async getPayment(req: GetPaymentRequest): Promise<GetPaymentResponse> {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { id: req.id },
        include: { booking: true },
      });
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${req.id} not found`);
      }
      return { payment };
    } catch (error) {
      return catchError(error);
    }
  }

  async updatePayment(req: UpdatePaymentRequest): Promise<UpdatePaymentResponse> {
    try {
      const { id, ...data } = req;
      const updateData: Prisma.PaymentUpdateInput = {};
      
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.transactionId) updateData.transactionId = data.transactionId;
      if (data.status) updateData.status = data.status as any;
      
      const payment = await this.prisma.payment.update({
        where: { id },
        data: updateData,
        include: { booking: true },
      });
      return { payment: this.mapToProtoPayment(payment) };
    } catch (error) {
      return catchError(error);
    }
  }

  async deletePayment(req: DeletePaymentRequest): Promise<DeletePaymentResponse> {
    try {
      await this.prisma.payment.delete({ where: { id: req.id } });
      return { result: { success: true, message: 'Payment deleted successfully' } };
    } catch (error) {
      return catchError(error);
    }
  }

  async listPayments(req: ListPaymentsRequest): Promise<ListPaymentsResponse> {
    try {
      const { pagination } = req;
      const [payments, total] = await Promise.all([
        this.prisma.payment.findMany({
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
          include: { booking: true },
        }),
        this.prisma.payment.count(),
      ]);
      
      return { 
        payments: payments.map(payment => this.mapToProtoPayment(payment)), 
        total 
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async filterPayments(req: FilterPaymentsRequest): Promise<FilterPaymentsResponse> {
    try {
      const { page, limit } = req.pagination;
      const { sortBy, order } = req.sort;
      const payments = await this.prisma.payment.findMany({
        where: req.filter,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      });
      const total = await this.prisma.payment.count({ where: req.filter });
      return { payments, total };
    } catch (error) {
      return catchError(error);
    }
  }



  async createTicket(req: CreateTicketRequest): Promise<CreateTicketResponse> {
    try {
      const ticket = await this.prisma.ticket.create({ data: req.ticket });
      return { ticket };
    } catch (error) {
      return catchError(error);
    }
  }

  async getTicket(req: GetTicketRequest): Promise<GetTicketResponse> {
    try {
      const ticket = await this.prisma.ticket.findUnique({ where: { id: req.id } });
      if (!ticket) {
        throw new NotFoundException(`Ticket with ID ${req.id} not found`);
      }
      return { ticket };
    } catch (error) {
      return catchError(error);
    }
  }

  async updateTicket(req: UpdateTicketRequest): Promise<UpdateTicketResponse> {
    try {
      const { id, ...data } = req;
      const ticket = await this.prisma.ticket.update({ where: { id }, data });
      return { ticket };
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteTicket(req: DeleteTicketRequest): Promise<DeleteTicketResponse> {
    try {
      await this.prisma.ticket.delete({ where: { id: req.id } });
      return { result: { success: true, message: 'Ticket deleted successfully' } };
    } catch (error) {
      return catchError(error);
    }
  }

  async listTickets(req: ListTicketsRequest): Promise<ListTicketsResponse> {
    try {
      const { page, limit } = req.pagination;
      const { sortBy, order } = req.sort;
      const tickets = await this.prisma.ticket.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      });
      const total = await this.prisma.ticket.count();
      return { tickets, total };
    } catch (error) {
      return catchError(error);
    }
  }

  async filterTickets(req: FilterTicketsRequest): Promise<FilterTicketsResponse> {
    return 
  }
}
