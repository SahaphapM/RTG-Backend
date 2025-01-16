import { Module } from '@nestjs/common';
import { JobQuotationsService } from './job-quotations.service';
import { JobQuotationsController } from './job-quotations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobQuotation } from './entities/job-quotation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobQuotation])],
  controllers: [JobQuotationsController],
  providers: [JobQuotationsService],
})
export class JobQuotationsModule {}
