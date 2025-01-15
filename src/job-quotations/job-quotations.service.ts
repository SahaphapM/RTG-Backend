import { Injectable } from '@nestjs/common';
import { CreateJobQuotationDto } from './dto/create-job-quotation.dto';
import { UpdateJobQuotationDto } from './dto/update-job-quotation.dto';

@Injectable()
export class JobQuotationsService {
  create(createJobQuotationDto: CreateJobQuotationDto) {
    return 'This action adds a new jobQuotation';
  }

  findAll() {
    return `This action returns all jobQuotations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobQuotation`;
  }

  update(id: number, updateJobQuotationDto: UpdateJobQuotationDto) {
    return `This action updates a #${id} jobQuotation`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobQuotation`;
  }
}
