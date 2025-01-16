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
  @Length(3, 32, {
    message: 'Project name must be between 3 and 32 characters long',
  })
  name: string;

  @IsString()
  @Length(5, 500, {
    message: 'Project description must be between 5 and 500 characters long',
  })
  description: string;

  @IsString()
  @Length(3, 16, {
    message: 'Project number must be between 3 and 16 characters long',
  })
  number: string;

  @IsNumber()
  discount: number | null;

  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid ISO date string' })
  startDate?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO date string' })
  endDate?: Date;

  @IsNumber()
  customerId: number; // ID of the associated customer

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectItemDto)
  projectItems: ProjectItemDto[];
}

class ProjectItemDto {
  @IsOptional()
  id?: number;

  @IsNumber()
  @IsNotEmpty()
  itemId: number; // Reference to Item

  @IsNumber()
  quantity: number | 1;

  @IsNumber()
  price: number | null;
}
