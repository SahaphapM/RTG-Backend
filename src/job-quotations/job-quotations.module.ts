import { Module } from '@nestjs/common';
import { JobQuotationsService } from './job-quotations.service';
import { JobQuotationsController } from './job-quotations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobQuotation } from './entities/job-quotation.entity';
import { Invoice } from './entities/invoice.entity';
import { Project } from 'src/projects/entities/project.entity';
import { InvoiceDetail } from './entities/invoiceDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobQuotation, Invoice, Project, InvoiceDetail]),
  ],
  controllers: [JobQuotationsController],
  providers: [JobQuotationsService],
})
export class JobQuotationsModule {}
