import { Test, TestingModule } from '@nestjs/testing';
import { SubcontractorsService } from './subcontractors.service';

describe('SubcontractorsService', () => {
  let service: SubcontractorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubcontractorsService],
    }).compile();

    service = module.get<SubcontractorsService>(SubcontractorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
