import { IsInt, IsOptional, IsString, IsIn, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1; // Default: page 1

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number = 10; // Default: 10 items per page

  @IsOptional()
  @IsString()
  search?: string; // Optional search query

  @IsOptional()
  @IsString()
  sortBy?: string = 'name'; // Default sorting field

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC'; // Sorting order
}
