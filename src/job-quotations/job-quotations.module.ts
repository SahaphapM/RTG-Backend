import { Module } from '@nestjs/common';
import { JobQuotationsService } from './job-quotations.service';
import { JobQuotationsController } from './job-quotations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobQuotation } from './entities/job-quotation.entity';
import { Payment } from './entities/payment.entity';
import { Project } from 'src/projects/entities/project.entity';
import { PaymentDetail } from './entities/paymentDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobQuotation, Payment, Project, PaymentDetail]),
  ],
  controllers: [JobQuotationsController],
  providers: [JobQuotationsService],
})
export class JobQuotationsModule {}
