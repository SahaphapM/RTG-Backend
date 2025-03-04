import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobQuotationDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  ourRef: string;

  @IsOptional()
  @IsString()
  invoiceTerms: string;

  @IsOptional()
  @IsString()
  deliveryTime: string;

  @IsOptional()
  @IsNumber()
  vatPercentage: number;

  @IsOptional()
  @IsNumber()
  priceOffered: number;

  @IsOptional()
  @IsString()
  deliveryPlace: string;

  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoices?: InvoiceDto[];
}

export class InvoiceDto {
  @IsOptional()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  ourTax: string;

  @IsOptional()
  @IsString()
  cusTax: string;

  @IsOptional()
  @IsDateString()
  paidDate: string | null;

  @IsOptional()
  @IsNumber()
  discount: number;

  @IsOptional()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  invoiceTerms: string;

  @IsOptional()
  @IsString()
  ourRef: string;

  @IsOptional()
  @IsString()
  bank: string;

  @IsOptional()
  @IsString()
  branch: string;

  @IsOptional()
  @IsString()
  accountName: string;

  @IsOptional()
  @IsString()
  accountNumber: string;

  @IsOptional()
  @IsString()
  swift: string;

  @IsOptional()
  @IsString()
  receivedBy: string;

  @IsOptional()
  @IsString()
  receivedDate: string | null;

  @IsOptional()
  @Type(() => InvoiceDetailDto)
  @IsArray()
  @ValidateNested({ each: true })
  invoiceDetails?: InvoiceDetailDto[];
}

export class InvoiceDetailDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  qty: number;

  @IsOptional()
  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  total: number;
}
