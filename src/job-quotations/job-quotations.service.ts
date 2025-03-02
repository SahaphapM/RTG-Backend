import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import {
  CreateJobQuotationDto,
  InvoiceDto,
} from './dto/create-job-quotation.dto';
import { UpdateJobQuotationDto } from './dto/update-job-quotation.dto';
import { JobQuotation } from './entities/job-quotation.entity';
import { Invoice } from './entities/invoice.entity';
import { Project } from 'src/projects/entities/project.entity';
import { InvoiceDetail } from './entities/invoiceDetail.entity';

@Injectable()
export class JobQuotationsService {
  constructor(
    @InjectRepository(JobQuotation)
    private jobQuotationRepository: Repository<JobQuotation>,

    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,

    @InjectRepository(InvoiceDetail)
    private invoiceDetailRepository: Repository<InvoiceDetail>,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<JobQuotation[]> {
    return this.jobQuotationRepository.find();
  }

  async findById(id: number): Promise<JobQuotation> {
    const jobQuotation = await this.jobQuotationRepository.findOne({
      where: { id },
      relations: { invoices: true },
    });
    if (!jobQuotation) {
      throw new NotFoundException(`Job Quotation with ID ${id} not found`);
    }
    return jobQuotation;
  }

  async findByProjectId(id: number): Promise<JobQuotation[]> {
    const jobQuotations = await this.jobQuotationRepository.find({
      where: { project: { id } },
      relations: { invoices: true },
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

  ////////////// Invoices //////////////

  async findAllInvoicesByJobQuotation(
    jobQuotationId: number,
  ): Promise<Invoice[]> {
    const invoices = await this.invoiceRepository.find({
      where: { jobQuotation: { id: jobQuotationId } },
      relations: { invoiceDetails: true },
    });
    return invoices;
  }

  async findInvoiceById(invoiceId: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
      relations: { invoiceDetails: true },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    } else {
      return invoice;
    }
  }

  async createInvoice(
    jobQuotationId: number,
    invoiceData: InvoiceDto,
  ): Promise<Invoice> {
    const jobQuotation = await this.findById(jobQuotationId);
    const invoice = this.invoiceRepository.create(invoiceData);

    const newTaxInvoiceNumber = await this.generateInvoiceNumber();
    invoice.taxInvoice = newTaxInvoiceNumber;
    invoice.jobQuotation = jobQuotation;

    // Save invoice first
    const savedInvoice = await this.invoiceRepository.save(invoice);

    return await this.findInvoiceById(savedInvoice.id);
  }

  async updateInvoice(
    invoiceId: number,
    invoiceData: InvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    Object.assign(invoice, invoiceData);

    await this.invoiceRepository.save(invoice);

    // Then create and save invoice details
    for (const detail of invoiceData.invoiceDetails) {
      const invoiceDetail = this.invoiceDetailRepository.create(detail);
      invoiceDetail.invoice = invoice; // Use savedInvoice, which now has an ID
      await this.invoiceDetailRepository.save(invoiceDetail);
    }

    return await this.findInvoiceById(invoiceId);
  }

  async deleteInvoice(invoiceId: number): Promise<void> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }
    await this.invoiceRepository.remove(invoice);
  }

  async generateInvoiceNumber(): Promise<string> {
    try {
      const currentYear = new Date().getFullYear().toString();

      // Query the latest invoice number for the current year
      const lastInvoice = await this.invoiceRepository.findOne({
        where: {
          taxInvoice: Like(`%/${currentYear}`),
        },
        order: {
          taxInvoice: 'DESC',
        },
      });

      // Extract the last number part and increment it
      let lastNumber = 0;
      if (lastInvoice) {
        const lastNumberString = lastInvoice.taxInvoice
          .split('/')[0]
          .replace(/\D/g, '');
        lastNumber = parseInt(lastNumberString, 10) || 0;
        // Generate the new invoice number
        const newInvoiceNumber = `${String(lastNumber + 1).padStart(3, '0')}/${currentYear}`;
        return newInvoiceNumber;
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
