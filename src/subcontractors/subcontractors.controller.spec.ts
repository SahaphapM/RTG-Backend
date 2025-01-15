import { Test, TestingModule } from '@nestjs/testing';
import { SubcontractorsController } from './subcontractors.controller';
import { SubcontractorsService } from './subcontractors.service';

describe('SubcontractorsController', () => {
  let controller: SubcontractorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcontractorsController],
      providers: [SubcontractorsService],
    }).compile();

    controller = module.get<SubcontractorsController>(SubcontractorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
