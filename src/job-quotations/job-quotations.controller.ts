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
  PaymentDto,
} from './dto/create-job-quotation.dto';
import { UpdateJobQuotationDto } from './dto/update-job-quotation.dto';
import { JobQuotationsService } from './job-quotations.service';
import { JobQuotation } from './entities/job-quotation.entity';
import { Payment } from './entities/payment.entity';

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

  ////////////// Payments //////////////

  @Get(':id/payments')
  async getAllPayments(
    @Param('id', ParseIntPipe) jobQuotationId: number,
  ): Promise<Payment[]> {
    return this.jobQuotationService.findAllPaymentsByJobQuotation(
      jobQuotationId,
    );
  }

  @Post(':id/payments')
  async createPayment(
    @Param('id', ParseIntPipe) jobQuotationId: number,
    @Body() paymentData: PaymentDto,
  ): Promise<Payment> {
    return this.jobQuotationService.createPayment(jobQuotationId, paymentData);
  }

  @Get('payments/:id')
  async getPaymentById(
    @Param('id', ParseIntPipe) paymentId: number,
  ): Promise<Payment> {
    return this.jobQuotationService.findPaymentById(paymentId);
  }

  @Put('payments/:paymentId')
  async updatePayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
    @Body() paymentData: PaymentDto,
  ): Promise<Payment> {
    return this.jobQuotationService.updatePayment(paymentId, paymentData);
  }

  @Delete('payments/:paymentId')
  async deletePayment(
    @Param('paymentId', ParseIntPipe) paymentId: number,
  ): Promise<void> {
    return this.jobQuotationService.deletePayment(paymentId);
  }
}
