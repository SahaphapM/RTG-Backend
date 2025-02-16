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
  @IsString()
  number: string;

  @IsString()
  qtNumber: string;

  @IsString()
  taxId: string;

  @IsString()
  ourRef: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsNumber()
  subcontractorId: number;

  @IsNumber()
  customerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  orderDetails: CreateOrderDetailDto[];

  @IsNumber()
  total: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  vat?: number;
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
