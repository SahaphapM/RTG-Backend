import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  CreateJobQuotationDto,
  InvoiceDto,
} from './dto/create-job-quotation.dto';
import { UpdateJobQuotationDto } from './dto/update-job-quotation.dto';
import { JobQuotationsService } from './job-quotations.service';
import { JobQuotation } from './entities/job-quotation.entity';
import { Invoice } from './entities/invoice.entity';

@Controller('job-quotations')
export class JobQuotationsController {
  constructor(private readonly jobQuotationService: JobQuotationsService) {}

  @Get()
  async getAllJobQuotations(): Promise<JobQuotation[]> {
    return this.jobQuotationService.findAll();
  }

  @Get(':id')
  async getJobQuotationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<JobQuotation> {
    console.log(id);
    return this.jobQuotationService.findById(id);
  }

  @Get('project/:id')
  async getJobQuotationByProjectId(
    @Param('id', ParseIntPipe) projectId: number,
  ): Promise<JobQuotation[]> {
    return this.jobQuotationService.findByProjectId(projectId);
  }

  @Post(':projectId')
  async createJobQuotation(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createJobQuotationDto: CreateJobQuotationDto,
  ): Promise<JobQuotation> {
    return this.jobQuotationService.create(projectId, createJobQuotationDto);
  }

  @Put(':id')
  async updateJobQuotation(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobQuotationDto: UpdateJobQuotationDto,
  ): Promise<JobQuotation> {
    return this.jobQuotationService.update(id, updateJobQuotationDto);
  }

  @Delete(':id')
  async deleteJobQuotation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.jobQuotationService.delete(id);
  }

  ////////////// Invoices //////////////

  @Get(':id/invoices')
  async getAllInvoices(
    @Param('id', ParseIntPipe) jobQuotationId: number,
  ): Promise<Invoice[]> {
    return this.jobQuotationService.findAllInvoicesByJobQuotation(
      jobQuotationId,
    );
  }

  @Post(':id/invoices')
  async createInvoice(
    @Param('id', ParseIntPipe) jobQuotationId: number,
    @Body() invoiceData: InvoiceDto,
  ): Promise<Invoice> {
    return this.jobQuotationService.createInvoice(jobQuotationId, invoiceData);
  }

  @Get('invoices/:id')
  async getInvoiceById(
    @Param('id', ParseIntPipe) invoiceId: number,
  ): Promise<Invoice> {
    return this.jobQuotationService.findInvoiceById(invoiceId);
  }

  @Put('invoices/:invoiceId')
  async updateInvoice(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
    @Body() invoiceData: InvoiceDto,
  ): Promise<Invoice> {
    return this.jobQuotationService.updateInvoice(invoiceId, invoiceData);
  }

  @Delete('invoices/:invoiceId')
  async deleteInvoice(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
  ): Promise<void> {
    return this.jobQuotationService.deleteInvoice(invoiceId);
  }
}
