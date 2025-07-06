import {
  Body,
  Controller,
  Inject,
  Post,
  OnModuleInit,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CINEMA_PACKAGE_NAME,
  CinemaServiceController,
  CreateMovieRequest,
  UpdateMovieRequest,
  CreateTheaterRequest,
  UpdateTheaterRequest,
  CreateScreenRequest,
  UpdateScreenRequest,
  CreateShowTimeRequest,
  UpdateShowTimeRequest,
  CheckSeatsAvailabilityRequest,
  ListTheatersRequest,
  ListShowTimesRequest,
  GetMovieRequest,
  DeleteMovieRequest,
  GetTheaterRequest,
  DeleteTheaterRequest,
  GetScreenRequest,
  ListScreensByTheaterRequest,
  DeleteScreenRequest,
  GetShowTimeRequest,
  DeleteShowTimeRequest,
  GetShowtimeSeatsRequest,
  ListMoviesRequest,
} from 'types/proto/cinema';

@Controller('cinema')
export class CinemaController implements OnModuleInit {
  private cinemaService: CinemaServiceController;

  constructor(@Inject(CINEMA_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.cinemaService = this.client.getService<CinemaServiceController>('CinemaService');
  }

  @Post('movie/create')
  createMovie(@Body() body: CreateMovieRequest) {
    return this.cinemaService.createMovie(body);
  }

  @Get('movie/get')
  getMovie(@Body() body: GetMovieRequest) {
    return this.cinemaService.getMovie(body);
  }

  @Get('movie/list')
  listMovies(@Body() body: ListMoviesRequest) {
    return this.cinemaService.listMovies(body);
  }

  @Patch('movie/update')
  updateMovie(@Body() body: UpdateMovieRequest) {
    return this.cinemaService.updateMovie(body);
  }

  @Delete('movie/delete')
  deleteMovie(@Body() body: DeleteMovieRequest) {
    return this.cinemaService.deleteMovie(body);
  }

  // --- Theater Endpoints ---

  @Post('theater/create')
  createTheater(@Body() body: CreateTheaterRequest) {
    return this.cinemaService.createTheater(body);
  }

  @Get('theater/get')
  getTheater(@Body() body: GetTheaterRequest) {
    return this.cinemaService.getTheater(body);
  }

  @Get('theater/list')
  listTheaters(@Body() body: ListTheatersRequest) {
    return this.cinemaService.listTheaters(body);
  }

  @Patch('theater/update')
  updateTheater(@Body() body: UpdateTheaterRequest) {
    return this.cinemaService.updateTheater(body);
  }

  @Delete('theater/delete')
  deleteTheater(@Body() body: DeleteTheaterRequest) {
    return this.cinemaService.deleteTheater(body);
  }

  // --- Screen Endpoints ---

  @Post('screen/create')
  createScreen(@Body() body: CreateScreenRequest) {
    return this.cinemaService.createScreen(body);
  }

  @Get('screen/get')
  getScreen(@Body() body: GetScreenRequest) {
    return this.cinemaService.getScreen(body);
  }

  @Get('screen/list-by-theater')
  listScreensByTheater(@Body() body: ListScreensByTheaterRequest) {
    return this.cinemaService.listScreensByTheater(body);
  }

  @Patch('screen/update')
  updateScreen(@Body() body: UpdateScreenRequest) {
    return this.cinemaService.updateScreen(body);
  }

  @Delete('screen/delete')
  deleteScreen(@Body() body: DeleteScreenRequest) {
    return this.cinemaService.deleteScreen(body);
  }

  // --- Showtime Endpoints ---

  @Post('showtime/create')
  createShowTime(@Body() body: CreateShowTimeRequest) {
    return this.cinemaService.createShowTime(body);
  }

  @Get('showtime/get')
  getShowTime(@Body() body: GetShowTimeRequest) {
    return this.cinemaService.getShowTime(body);
  }

  @Get('showtime/list')
  listShowTimes(@Body() body: ListShowTimesRequest) {
    return this.cinemaService.listShowTimes(body);
  }

  @Patch('showtime/update')
  updateShowTime(@Body() body: UpdateShowTimeRequest) {
    return this.cinemaService.updateShowTime(body);
  }

  @Delete('showtime/delete')
  deleteShowTime(@Body() body: DeleteShowTimeRequest) {
    return this.cinemaService.deleteShowTime(body);
  }

  // --- Seat Endpoints ---

  @Get('showtime/get-seats')
  getShowtimeSeats(@Body() body: GetShowtimeSeatsRequest) {
    return this.cinemaService.getShowtimeSeats(body);
  }

  @Get('showtime/check-seats')
  checkSeatsAvailability(@Body() body: CheckSeatsAvailabilityRequest) {
    return this.cinemaService.checkSeatsAvailability(body);
  }
}

