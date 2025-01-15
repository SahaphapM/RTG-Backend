import { Test, TestingModule } from '@nestjs/testing';
import { JobQuotationsService } from './job-quotations.service';

describe('JobQuotationsService', () => {
  let service: JobQuotationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobQuotationsService],
    }).compile();

    service = module.get<JobQuotationsService>(JobQuotationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
