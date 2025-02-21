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
import { InvoiceMethods } from '../entities/job-quotation.entity';

export class CreateJobQuotationDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  customerRef: string;

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
  bestRegards: string;

  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsEnum(InvoiceMethods)
  invoiceMethod: InvoiceMethods;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceDto)
  invoices?: InvoiceDto[];
}

export class InvoiceDto {
  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  agentName: string;

  @IsOptional()
  @IsString()
  agentEmail: string;

  @IsOptional()
  @IsString()
  agentContact: string;

  @IsOptional()
  @IsString()
  ourTax: string;

  @IsOptional()
  @IsString()
  cusTax: string;

  @IsOptional()
  @IsString()
  taxInvoice: string;

  @IsOptional()
  @IsDateString()
  paidDate: Date;

  @IsOptional()
  @Type(() => InvoiceDetailDto)
  @IsArray()
  @ValidateNested({ each: true })
  invoiceDetails?: InvoiceDetailDto[];
}

export class InvoiceDetailDto {
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
