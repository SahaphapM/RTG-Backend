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
import { Customer } from 'src/customers/entities/customer.entity';

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
  status: string | null;

  @IsOptional()
  customer: Partial<Customer> | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectItemDto)
  projectItems: ProjectItemDto[] | null;
}
class ProjectItemDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  @IsString()
  @Length(0, 255, { message: 'Name must be between 0 and 255 characters long' })
  name: string;

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
