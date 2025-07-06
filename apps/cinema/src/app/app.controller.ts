import { Controller } from '@nestjs/common';
import { CinemaService } from './app.service';
import {
  CinemaServiceControllerMethods,
  CinemaServiceController,
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
} from '@app/types/proto/cinema';
import { Empty } from '@app/types/google/protobuf/empty';
import { Observable } from 'rxjs';

@Controller()
@CinemaServiceControllerMethods()
export class CinemaController implements CinemaServiceController {
  constructor(private readonly cinemaService: CinemaService) {}

  createMovie(request: CreateMovieRequest): Promise<Movie> | Observable<Movie> | Movie {
    return this.cinemaService.createMovie(request);
  }

  getMovie(request: GetMovieRequest): Promise<Movie> | Observable<Movie> | Movie {
    return this.cinemaService.getMovie(request);
  }

  listMovies(request: ListMoviesRequest): Promise<ListMoviesResponse> | Observable<ListMoviesResponse> | ListMoviesResponse {
    return this.cinemaService.listMovies(request);
  }

  updateMovie(request: UpdateMovieRequest): Promise<Movie> | Observable<Movie> | Movie {
    return this.cinemaService.updateMovie(request);
  }

  deleteMovie(request: DeleteMovieRequest): Promise<Empty> | Observable<Empty> | Empty {
    return this.cinemaService.deleteMovie(request);
  }

  createTheater(request: CreateTheaterRequest): Promise<Theater> | Observable<Theater> | Theater {
    return this.cinemaService.createTheater(request);
  }

  getTheater(request: GetTheaterRequest): Promise<Theater> | Observable<Theater> | Theater {
    return this.cinemaService.getTheater(request);
  }

  listTheaters(request: ListTheatersRequest): Promise<ListTheatersResponse> | Observable<ListTheatersResponse> | ListTheatersResponse {
    return this.cinemaService.listTheaters(request);
  }

  updateTheater(request: UpdateTheaterRequest): Promise<Theater> | Observable<Theater> | Theater {
    return this.cinemaService.updateTheater(request);
  }

  deleteTheater(request: DeleteTheaterRequest): Promise<Empty> | Observable<Empty> | Empty {
    return this.cinemaService.deleteTheater(request);
  }

  createScreen(request: CreateScreenRequest): Promise<Screen> | Observable<Screen> | Screen {
    return this.cinemaService.createScreen(request);
  }

  getScreen(request: GetScreenRequest): Promise<Screen> | Observable<Screen> | Screen {
    return this.cinemaService.getScreen(request);
  }

  listScreensByTheater(request: ListScreensByTheaterRequest): Promise<ListScreensResponse> | Observable<ListScreensResponse> | ListScreensResponse {
    return this.cinemaService.listScreensByTheater(request);
  }

  updateScreen(request: UpdateScreenRequest): Promise<Screen> | Observable<Screen> | Screen {
    return this.cinemaService.updateScreen(request);
  }

  deleteScreen(request: DeleteScreenRequest): Promise<Empty> | Observable<Empty> | Empty {
    return this.cinemaService.deleteScreen(request);
  }

  createShowTime(request: CreateShowTimeRequest): Promise<Showtime> | Observable<Showtime> | Showtime {
    return this.cinemaService.createShowTime(request);
  }

  getShowTime(request: GetShowTimeRequest): Promise<Showtime> | Observable<Showtime> | Showtime {
    return this.cinemaService.getShowTime(request);
  }

  listShowTimes(request: ListShowTimesRequest): Promise<ListShowTimesResponse> | Observable<ListShowTimesResponse> | ListShowTimesResponse {
    return this.cinemaService.listShowTimes(request);
  }

  updateShowTime(request: UpdateShowTimeRequest): Promise<Showtime> | Observable<Showtime> | Showtime {
    return this.cinemaService.updateShowTime(request);
  }

  deleteShowTime(request: DeleteShowTimeRequest): Promise<Empty> | Observable<Empty> | Empty {
    return this.cinemaService.deleteShowTime(request);
  }

  getShowtimeSeats(request: GetShowtimeSeatsRequest): Promise<GetShowtimeSeatsResponse> | Observable<GetShowtimeSeatsResponse> | GetShowtimeSeatsResponse {
    return this.cinemaService.getShowtimeSeats(request);
  }

  checkSeatsAvailability(request: CheckSeatsAvailabilityRequest): Promise<CheckSeatsAvailabilityResponse> | Observable<CheckSeatsAvailabilityResponse> | CheckSeatsAvailabilityResponse {
    return this.cinemaService.checkSeatsAvailability(request);
  }
}
