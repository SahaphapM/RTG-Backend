import { PartialType } from '@nestjs/mapped-types';
import { CreateJobQuotationDto } from './create-job-quotation.dto';

export class UpdateJobQuotationDto extends PartialType(CreateJobQuotationDto) {}
