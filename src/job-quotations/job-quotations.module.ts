import { Module } from '@nestjs/common';
import { JobQuotationsService } from './job-quotations.service';
import { JobQuotationsController } from './job-quotations.controller';

@Module({
  controllers: [JobQuotationsController],
  providers: [JobQuotationsService],
})
export class JobQuotationsModule {}
