import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service'; 
import {
  Booking,
  CreateBookingRequest,
  CreateBookingResponse,

  CreateTicketRequest,
  CreateTicketResponse,
  DeleteBookingRequest,
  DeleteBookingResponse,

  DeleteTicketRequest,
  DeleteTicketResponse,
  FilterBookingsRequest,
  FilterBookingsResponse,

  FilterTicketsRequest,
  FilterTicketsResponse,
  GetBookingRequest,
  GetBookingResponse,

  GetTicketRequest,
  GetTicketResponse,
  ListBookingsRequest,
  ListBookingsResponse,

  ListTicketsRequest,
  ListTicketsResponse,

  UpdateBookingRequest,
  UpdateBookingResponse,
 
  UpdateTicketRequest,
  UpdateTicketResponse,
} from '@app/types/proto/booking'; 
import { catchError } from '@app/common/helper/catch.error'; 

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createBooking(req: CreateBookingRequest): Promise<CreateBookingResponse> {
    try {
      const { userId, showtimeId, seatsId, totalAmount, expiresAt} = req;
      if(!userId || !seatsId || !showtimeId || !totalAmount || !expiresAt) {
        throw new BadRequestException('All field are required')
      }

      const booking = await this.prisma.booking.create({data: {
        userId,
        showtimeId: showtimeId,
        seatsId: seatsId,
        totalAmount: totalAmount,
        expiresAt: expiresAt
      }})

      return {booking: booking as unknown as Booking};
    } catch (error) {
      return catchError(error)
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
      return { booking: booking as unknown as Booking };
    } catch (error) {
      return catchError(error);
    }
  }

  async updateBooking(req: UpdateBookingRequest): Promise<UpdateBookingResponse> {
    try {
      const { id,  totalAmount, expiresAt} = req;
      const booking = await this.prisma.booking.update({
        where: { id },
        data: {
          totalAmount,
          expiresAt
        },
        include: { tickets: true, payments: true },
      });
      return { booking: booking as unknown as Booking };
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
      const { page, limit } = req.pagination;
      const { sortBy, order } = req.sort;
      const bookings = await this.prisma.booking.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: { tickets: true, payments: true },
      });
      const total = await this.prisma.booking.count();
      return { bookings: bookings as unknown as Booking[], total };
    } catch (error) {
      return catchError(error);
    }
  }

  async filterBookings(req: FilterBookingsRequest): Promise<FilterBookingsResponse> {
  try {
    const { page, limit } = req.pagination;

    const bookings = await this.prisma.booking.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        tickets: true,
        payments: true,
      },
    });

    const total = await this.prisma.booking.count();

    return {
      bookings: bookings as unknown as Booking[],
      total,
    };
  } catch (error) {
    return catchError(error);
  }
  }


async createTicket(req: CreateTicketRequest): Promise<CreateTicketResponse> {
    try {
      const ticket = await this.prisma.ticket.create({ data: {
        id: req.ticket.id,
        price: req.ticket.price,
        bookingId: req.ticket.bookingId,
        seatId: req.ticket.seatId
      }});
      const newTicket = {
        id: ticket.id,
        price: ticket.price,
        bookingId: ticket.bookingId,
        seatId: ticket.seatId,
        createdAt: String(ticket.createdAt),
        updatedAt: String(ticket.updatedAt)
      };

      return { ticket: newTicket }; 
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
      const newTicket = {
        id: ticket.id,
        price: ticket.price,
        bookingId: ticket.bookingId,
        seatId: ticket.seatId,
        createdAt: String(ticket.createdAt),
        updatedAt: String(ticket.updatedAt)
      };
      return { ticket: newTicket };
    } catch (error) {
      return catchError(error);
    }
  }

  async updateTicket(req: UpdateTicketRequest): Promise<UpdateTicketResponse> {
    try {
      const { id, ...data } = req;
      const ticket = await this.prisma.ticket.update({ where: { id }, data: {
        price: data.price,
        seatId: data.seatId,
      } });
      const newTicket = {
        id: ticket.id,
        price: ticket.price,
        seatId: ticket.seatId,
        bookingId: ticket.bookingId,
        createdAt: String(ticket.createdAt),
        updatedAt: String(ticket.updatedAt)
      };
      return { ticket: newTicket };
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
      
      const formattedTickets = tickets.map(ticket => ({
        ...ticket,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString()
      }));
      
      return { tickets: formattedTickets, total };
    } catch (error) {
      return catchError(error);
    }
  }

  async filterTickets(req: FilterTicketsRequest): Promise<FilterTicketsResponse> {
    try {
      const { page, limit } = req.pagination;
      const { sortBy, order } = req.sort;
      const tickets = await this.prisma.ticket.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      });
      const total = await this.prisma.ticket.count();
      
      const formattedTickets = tickets.map(ticket => ({
        ...ticket,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString()
      }));
      
      return { tickets: formattedTickets, total };
    } catch (error) {
      return catchError(error);
    }
  }
}
