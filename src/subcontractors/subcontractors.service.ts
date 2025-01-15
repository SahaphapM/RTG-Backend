import { Injectable } from '@nestjs/common';
import { CreateSubcontractorDto } from './dto/create-subcontractor.dto';
import { UpdateSubcontractorDto } from './dto/update-subcontractor.dto';

@Injectable()
export class SubcontractorsService {
  create(createSubcontractorDto: CreateSubcontractorDto) {
    return 'This action adds a new subcontractor';
  }

  findAll() {
    return `This action returns all subcontractors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subcontractor`;
  }

  update(id: number, updateSubcontractorDto: UpdateSubcontractorDto) {
    return `This action updates a #${id} subcontractor`;
  }

  remove(id: number) {
    return `This action removes a #${id} subcontractor`;
  }
}
