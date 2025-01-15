import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobQuotationsService } from './job-quotations.service';
import { CreateJobQuotationDto } from './dto/create-job-quotation.dto';
import { UpdateJobQuotationDto } from './dto/update-job-quotation.dto';

@Controller('job-quotations')
export class JobQuotationsController {
  constructor(private readonly jobQuotationsService: JobQuotationsService) {}

  @Post()
  create(@Body() createJobQuotationDto: CreateJobQuotationDto) {
    return this.jobQuotationsService.create(createJobQuotationDto);
  }

  @Get()
  findAll() {
    return this.jobQuotationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobQuotationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobQuotationDto: UpdateJobQuotationDto) {
    return this.jobQuotationsService.update(+id, updateJobQuotationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobQuotationsService.remove(+id);
  }
}
