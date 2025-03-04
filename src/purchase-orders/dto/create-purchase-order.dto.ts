import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import { Customer } from 'src/customers/entities/customer.entity';

export class CreatePurchaseOrderDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  qtNumber: string;

  @IsOptional()
  @IsString()
  taxId: string;

  @IsOptional()
  @IsString()
  ourRef: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  date: string;

  @IsOptional()
  subcontractor: Partial<Subcontractor> | null;

  @IsOptional()
  customer: Partial<Customer> | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  orderDetails: CreateOrderDetailDto[];

  @IsOptional()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  vat?: number;

  @IsOptional()
  file: string | null;

  @IsOptional()
  @IsDateString()
  shippedDate: string | null;
}

export class CreateOrderDetailDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  qty: number;

  @IsOptional()
  @IsNumber()
  total?: number | null;
}
