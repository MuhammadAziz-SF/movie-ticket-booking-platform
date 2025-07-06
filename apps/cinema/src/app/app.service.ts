import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { catchError } from '@app/common/helper/catch.error';
import {
  CreateMovieRequest,
  Movie,
  GetMovieRequest,
  ListMoviesRequest,
  ListMoviesResponse,
  UpdateMovieRequest,
  DeleteMovieRequest,
  CreateTheaterRequest,
  Theater,
  GetTheaterRequest,
  ListTheatersRequest,
  ListTheatersResponse,
  UpdateTheaterRequest,
  DeleteTheaterRequest,
  CreateScreenRequest,
  Screen,
  GetScreenRequest,
  ListScreensByTheaterRequest,
  ListScreensResponse,
  UpdateScreenRequest,
  DeleteScreenRequest,
  CreateShowTimeRequest,
  Showtime,
  GetShowTimeRequest,
  ListShowTimesRequest,
  ListShowTimesResponse,
  UpdateShowTimeRequest,
  DeleteShowTimeRequest,
  GetShowtimeSeatsRequest,
  GetShowtimeSeatsResponse,
  CheckSeatsAvailabilityRequest,
  CheckSeatsAvailabilityResponse,
  ShowtimeSeat,
} from '@app/types/proto/cinema';
import { Empty } from '@app/types/google/protobuf/empty';
import { Timestamp } from '@app/types/google/protobuf/timestamp';

@Injectable()
export class CinemaService {
  constructor(private readonly prisma: PrismaService) {}

  private dateToTimestamp(date: Date): Timestamp {
    if (!date) return null;
    return {
      seconds: Math.floor(date.getTime() / 1000),
      nanos: (date.getTime() % 1000) * 1e6,
    };
  }

  async createMovie(request: CreateMovieRequest): Promise<Movie> {
    try {
      const { title } = request;
      const isExists = await this.prisma.movie.findFirst({ where: { title } });
      if (isExists) {
        throw new BadRequestException('Movie already created');
      }
      const newMovie = await this.prisma.movie.create({
        data: {
          title: request.title,
          description: request.description,
          releaseDate: new Date(request.releaseDate.seconds * 1000),
          durationInMinutes: request.durationInMinutes,
          posterUrl: request.posterUrl,
        },
      });

      return { ...newMovie, releaseDate: this.dateToTimestamp(newMovie.releaseDate)};
    } catch (error) {
      return catchError(error);
    }
  }

  async getMovie(request: GetMovieRequest): Promise<Movie> {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: { id: request.id },
        include: { showtimes: true },
      });
      if (!movie) {
        throw new NotFoundException('Movie not found');
      }

      return {...movie, releaseDate: this.dateToTimestamp(movie.releaseDate)};
    } catch (error) {
      return catchError(error);
    }
  }

  async listMovies(request: ListMoviesRequest): Promise<ListMoviesResponse> {
    try {
      const movies = await this.prisma.movie.findMany({
        include: { showtimes: true },
      });
      const responseMovies = movies.map((movie) => {
        const showTimes = movie.showtimes.map((st) => ({
          ...st,
          basePrice: st.basePrice,
          startTime: this.dateToTimestamp(st.startTime),
        }));
        return { ...movie, releaseDate: this.dateToTimestamp(movie.releaseDate), showTimes };
      });
      return { movies: responseMovies };
    } catch (error) {
      return catchError(error);
    }
  }

  async updateMovie(request: UpdateMovieRequest): Promise<Movie> {
    try {
      const { id, ...data } = request;
      const movie = await this.prisma.movie.update({
        where: { id },
        data: {
          ...data,
          ...(data.releaseDate && { releaseDate: new Date(data.releaseDate.seconds * 1000) }),
        },
      });
      return { ...movie, releaseDate: this.dateToTimestamp(movie.releaseDate)};
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteMovie(request: DeleteMovieRequest): Promise<Empty> {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id: request.id } });
      if (!movie) {
        throw new NotFoundException('Movie not found');
      }
      await this.prisma.movie.delete({ where: { id: request.id } });
      return {};
    } catch (error) {
      return catchError(error);
    }
  }

  async createTheater(request: CreateTheaterRequest): Promise<Theater> {
    try {
      const theater = await this.prisma.theater.findFirst({ where: { name: request.name } });
      if (theater) {
        throw new ConflictException('Theater is already created!');
      }
      const newTheater = await this.prisma.theater.create({ data: request });
      return { ...newTheater, screens: [] };
    } catch (error) {
      return catchError(error);
    }
  }

  async getTheater(request: GetTheaterRequest): Promise<Theater> {
    try {
      const theater = await this.prisma.theater.findUnique({
        where: { id: request.id },
        include: { screens: { include: { seats: true } } },
      });
      if (!theater) {
        throw new NotFoundException('Theater not found');
      }
      return theater;
    } catch (error) {
      return catchError(error);
    }
  }

  async listTheaters(request: ListTheatersRequest): Promise<ListTheatersResponse> {
    try {
      const theaters = await this.prisma.theater.findMany({
        where: { ...(request.city && { city: request.city }) },
        include: { screens: { include: { seats: true } } },
      });
      return { theaters };
    } catch (error) {
      return catchError(error);
    }
  }

  async updateTheater(request: UpdateTheaterRequest): Promise<Theater> {
    try {
      const { id, ...data } = request;
      const updatedTheater = await this.prisma.theater.update({ where: { id }, data });
      return { ...updatedTheater, screens: [] };
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteTheater(request: DeleteTheaterRequest): Promise<Empty> {
    try {
      const theater = await this.prisma.theater.findUnique({ where: { id: request.id } });
      if (!theater) {
        throw new NotFoundException('Theater not found!');
      }
      await this.prisma.theater.delete({ where: { id: request.id } });
      return {};
    } catch (error) {
      return catchError(error);
    }
  }

  async createScreen(request: CreateScreenRequest): Promise<Screen> {
    try {
      const screen = await this.prisma.screen.create({
        data: {
          name: request.name,
          capacity: request.capacity,
          theaterId: request.theaterId,
        },
      });
      return { ...screen, seats: [] };
    } catch (error) {
      return catchError(error);
    }
  }

  async getScreen(request: GetScreenRequest): Promise<Screen> {
    try {
      const screen = await this.prisma.screen.findUnique({
        where: { id: request.id },
        include: { seats: true },
      });
      if (!screen) {
        throw new NotFoundException('Screen not found');
      }
      return screen;
    } catch (error) {
      return catchError(error);
    }
  }

  async listScreensByTheater(request: ListScreensByTheaterRequest): Promise<ListScreensResponse> {
    try {
      const screens = await this.prisma.screen.findMany({
        where: { theaterId: request.theaterId },
        include: { seats: true },
      });
      return { screens };
    } catch (error) {
      return catchError(error);
    }
  }

  async updateScreen(request: UpdateScreenRequest): Promise<Screen> {
    try {
      const { id, ...data } = request;
      const screen = await this.prisma.screen.update({ where: { id }, data });
      return { ...screen, seats: [] };
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteScreen(request: DeleteScreenRequest): Promise<Empty> {
    try {
      const screen = await this.prisma.screen.findUnique({ where: { id: request.id } });
      if (!screen) {
        throw new NotFoundException('Screen not found');
      }
      await this.prisma.screen.delete({ where: { id: request.id } });
      return {};
    } catch (error) {
      return catchError(error);
    }
  }

  async createShowTime(request: CreateShowTimeRequest): Promise<Showtime> {
    try {
      const time = new Date(request.startTime.seconds * 1000);
      const showtime = await this.prisma.showtime.create({
        data: {
          startTime: time,
          basePrice: request.basePrice,
          movieId: request.movieId,
          screenId: request.screenId,
        },
      });
      return { ...showtime, basePrice: showtime.basePrice, startTime: this.dateToTimestamp(time) };
    } catch (error) {
      return catchError(error);
    }
  }

  async getShowTime(request: GetShowTimeRequest): Promise<Showtime> {
    try {
      const showtime = await this.prisma.showtime.findUnique({
        where: { id: request.id },
        include: { movie: true, screen: { include: { seats: true } } },
      });
      if (!showtime) {
        throw new NotFoundException('Showtime not found');
      }
      const movieWithTimestamp = {
        ...showtime.movie,
        releaseDate: this.dateToTimestamp(showtime.movie.releaseDate),
        showTimes: [],
      };
      return { 
          ...showtime, 
          basePrice: showtime.basePrice,
          startTime: this.dateToTimestamp(showtime.startTime), 
        };
    } catch (error) {
      return catchError(error);
    }
  }

  async listShowTimes(request: ListShowTimesRequest): Promise<ListShowTimesResponse> {
    try {
      const showtimes = await this.prisma.showtime.findMany({ 
        where: {
            ...(request.movieId && { movieId: request.movieId }),
            ...(request.theaterId && { screen: { theaterId: request.theaterId } })
        },
        include: { movie: true, screen: true }
      });
      const responseShowtimes = showtimes.map((st) => {
        const movieWithTimestamp = {
            ...st.movie,
            releaseDate: this.dateToTimestamp(st.movie.releaseDate),
            showTimes: []
        }
        return {
            ...st,
            basePrice: st.basePrice,
            startTime: this.dateToTimestamp(st.startTime),
            movie: movieWithTimestamp,
            screen: {...st.screen, seats: []}
        }
      });
      return { showTimes: responseShowtimes };
    } catch (error) {
      return catchError(error);
    }
  }

async updateShowTime(request: UpdateShowTimeRequest): Promise<Showtime> {
    try {
      const { id, basePrice, startTime } = request;

      const dataToUpdate: { basePrice?: number; startTime?: Date } = {};

      if (basePrice !== null && basePrice !== undefined) {
        dataToUpdate.basePrice = basePrice;
      }

      if (startTime) {
        dataToUpdate.startTime = new Date(startTime.seconds * 1000);
      }
      
      if (Object.keys(dataToUpdate).length === 0) {
        const existingShowtime = await this.prisma.showtime.findUnique({ where: { id } });
        if (!existingShowtime) {
            throw new NotFoundException('Showtime not found');
        }
        return {
            ...existingShowtime,
            basePrice: existingShowtime.basePrice,
            startTime: this.dateToTimestamp(existingShowtime.startTime)
        };
      }

      const updatedShowtime = await this.prisma.showtime.update({
        where: { id },
        data: dataToUpdate, 
      });

      return { 
        ...updatedShowtime, 
        basePrice: updatedShowtime.basePrice, 
        startTime: this.dateToTimestamp(updatedShowtime.startTime) 
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async deleteShowTime(request: DeleteShowTimeRequest): Promise<Empty> {
    try {
      const showTime = await this.prisma.showtime.findUnique({ where: { id: request.id } });
      if (!showTime) {
        throw new NotFoundException('Showtime not found!');
      }
      await this.prisma.showtime.delete({ where: { id: request.id } });
      return {};
    } catch (error) {
      return catchError(error);
    }
  }

  async getShowtimeSeats(request: GetShowtimeSeatsRequest): Promise<GetShowtimeSeatsResponse> {
    try {
      const showtime = await this.prisma.showtime.findUnique({
        where: { id: request.showtimeId },
        select: { screenId: true },
      });
      if (!showtime) throw new NotFoundException('Showtime not found');

      const allSeats = await this.prisma.seat.findMany({ where: { screenId: showtime.screenId } });
      const bookedTickets = await this.prisma.ticket.findMany({
        where: { booking: { showtimeId: request.showtimeId } },
        select: { seatId: true },
      });
      const bookedSeatIds = new Set(bookedTickets.map((t) => t.seatId));

      const seats: ShowtimeSeat[] = allSeats.map((seat) => ({
        seatInfo: seat,
        isAvailable: !bookedSeatIds.has(seat.id),
      }));

      return { seats };
    } catch (error) {
      return catchError(error);
    }
  }

  async checkSeatsAvailability(request: CheckSeatsAvailabilityRequest): Promise<CheckSeatsAvailabilityResponse> {
    try {
      const bookedTickets = await this.prisma.ticket.findMany({
        where: {
          booking: { showtimeId: request.showtimeId },
          seatId: { in: request.seatIds },
        },
        select: { seatId: true },
      });

      const unavailableSeatIds = bookedTickets.map((t) => t.seatId);
      const areAvailable = unavailableSeatIds.length === 0;

      return { areAvailable, unavailableSeatIds };
    } catch (error) {
      return catchError(error);
    }
  }
}
