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
import { PaymentMethods } from '../entities/job-quotation.entity';

export class CreateJobQuotationDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  customerRef: string;

  @IsOptional()
  @IsString()
  paymentTerms: string;

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
  @IsEnum(PaymentMethods)
  paymentMethod: PaymentMethods;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  payments?: PaymentDto[];
}

export class PaymentDto {
  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsDateString()
  date: Date;

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
  @Type(() => PaymentDetailDto)
  @IsArray()
  @ValidateNested({ each: true })
  paymentDetails?: PaymentDetailDto[];
}

export class PaymentDetailDto {
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
