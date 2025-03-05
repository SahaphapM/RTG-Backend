import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Project } from 'src/projects/entities/project.entity';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';

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
  file: string | null;

  @IsOptional()
  project: Partial<Project> | null;

  @IsOptional()
  subcontractor: Partial<Subcontractor> | null;
}
