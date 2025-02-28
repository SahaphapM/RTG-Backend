import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDateString,
  Length,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  // @IsString()
  @IsOptional()
  // @Length(3, 16, {
  //   message: 'Project number must be between 3 and 16 characters long',
  // })
  number: string;

  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid ISO date string' })
  startDate: string | null;

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO date string' })
  endDate: string | null;

  @IsOptional()
  @IsNumber()
  customerId: number | null; // ID of the associated customer

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectItemDto)
  projectItems: ProjectItemDto[] | null;
}
class ProjectItemDto {
  @IsOptional()
  id?: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  itemId: number; // Reference to Item

  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsOptional()
  @IsNumber()
  price: number | null;

  @IsOptional()
  @IsNumber()
  totalPrice: number | null;
}
