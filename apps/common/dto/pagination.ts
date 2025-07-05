import { IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  page_size?: number = 10;
}
