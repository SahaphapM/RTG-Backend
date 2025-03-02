import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsNumber()
  subcontractorId: number;

  @IsOptional()
  @IsNumber()
  customerId: number;

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
  file: string;

  @IsOptional()
  @IsDateString()
  shippedDate: string | null;
}

export class CreateOrderDetailDto {
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
