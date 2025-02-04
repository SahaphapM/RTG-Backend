import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateJobQuotationDto,
  PaymentDto,
} from './dto/create-job-quotation.dto';
import { UpdateJobQuotationDto } from './dto/update-job-quotation.dto';
import { JobQuotation } from './entities/job-quotation.entity';
import { Payment } from './entities/payment.entity';
import { Project } from 'src/projects/entities/project.entity';
import { PaymentDetail } from './entities/paymentDetail.entity';

@Injectable()
export class JobQuotationsService {
  constructor(
    @InjectRepository(JobQuotation)
    private jobQuotationRepository: Repository<JobQuotation>,

    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(PaymentDetail)
    private paymentDetailRepository: Repository<PaymentDetail>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<JobQuotation[]> {
    return this.jobQuotationRepository.find({ relations: ['project'] });
  }

  async findById(id: number): Promise<JobQuotation> {
    const jobQuotation = await this.jobQuotationRepository.findOne({
      where: { id },
      relations: ['payments'],
    });
    console.log(jobQuotation);
    if (!jobQuotation) {
      throw new NotFoundException(`Job Quotation with ID ${id} not found`);
    }
    return jobQuotation;
  }

  async findByProjectId(id: number): Promise<JobQuotation[]> {
    const jobQuotations = await this.jobQuotationRepository.find({
      where: { project: { id } },
      relations: ['payments'],
    });

    if (!jobQuotations) {
      throw new NotFoundException(
        `Job Quotation with Project ID ${id} not found`,
      );
    }
    return jobQuotations;
  }

  async create(
    projectId: number,
    quotationData: CreateJobQuotationDto,
  ): Promise<JobQuotation> {
    console.log(projectId);
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
    const jobQuotation = this.jobQuotationRepository.create({
      ...quotationData,
      project,
    });

    try {
      const savedJobQuotation =
        await this.jobQuotationRepository.save(jobQuotation);
      return savedJobQuotation;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(
    id: number,
    updateJobQuotationDto: UpdateJobQuotationDto,
  ): Promise<JobQuotation> {
    const jobQuotation = await this.findById(id);
    Object.assign(jobQuotation, updateJobQuotationDto);
    return this.jobQuotationRepository.save(jobQuotation);
  }

  async delete(id: number): Promise<void> {
    const jobQuotation = await this.findById(id);
    await this.jobQuotationRepository.remove(jobQuotation);
  }

  ////////////// Payments //////////////

  async findAllPaymentsByJobQuotation(
    jobQuotationId: number,
  ): Promise<Payment[]> {
    const payments = await this.paymentRepository.find({
      where: { jobQuotation: { id: jobQuotationId } },
      relations: { paymentDetails: true },
    });
    return payments;
  }

  async findPaymentById(paymentId: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: { paymentDetails: true },
    });
    console.log(payment);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    } else {
      return payment;
    }
  }

  async createPayment(
    jobQuotationId: number,
    paymentData: PaymentDto,
  ): Promise<Payment> {
    const jobQuotation = await this.findById(jobQuotationId);
    const payment = this.paymentRepository.create(paymentData);
    payment.jobQuotation = jobQuotation;

    // Save payment first
    const savedPayment = await this.paymentRepository.save(payment);

    // Then create and save payment details
    for (const detail of paymentData.paymentDetails) {
      const paymentDetail = this.paymentDetailRepository.create(detail);
      paymentDetail.payment = savedPayment; // Use savedPayment, which now has an ID
      await this.paymentDetailRepository.save(paymentDetail);
    }

    return await this.findPaymentById(savedPayment.id);
  }

  async updatePayment(
    paymentId: number,
    paymentData: PaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }
    Object.assign(payment, paymentData);
    return this.paymentRepository.save(payment);
  }

  async deletePayment(paymentId: number): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }
    await this.paymentRepository.remove(payment);
  }
}
