import { Test, TestingModule } from '@nestjs/testing';
import { JobQuotationsController } from './job-quotations.controller';
import { JobQuotationsService } from './job-quotations.service';

describe('JobQuotationsController', () => {
  let controller: JobQuotationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobQuotationsController],
      providers: [JobQuotationsService],
    }).compile();

    controller = module.get<JobQuotationsController>(JobQuotationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
