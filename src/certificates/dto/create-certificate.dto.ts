import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsOptional()
  date: string; // ISO date

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  file: string;

  @IsOptional()
  @IsNumber()
  projectId: number;

  @IsOptional()
  @IsNumber()
  subcontractorId: number;
}
