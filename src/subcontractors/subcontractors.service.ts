import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcontractor } from './entities/subcontractor.entity';
import { CreateSubcontractorDto } from './dto/create-subcontractor.dto';
import { UpdateSubcontractorDto } from './dto/update-subcontractor.dto';

@Injectable()
export class SubcontractorsService {
  constructor(
    @InjectRepository(Subcontractor)
    private subcontractorRepository: Repository<Subcontractor>,
  ) {}

  async findAll(): Promise<Subcontractor[]> {
    return this.subcontractorRepository.find();
  }

  async findById(id: number): Promise<Subcontractor> {
    const subcontractor = await this.subcontractorRepository.findOne({
      where: { id },
    });
    if (!subcontractor) {
      throw new NotFoundException(`Subcontractor with ID ${id} not found`);
    }
    return subcontractor;
  }

  async create(
    createSubcontractorDto: CreateSubcontractorDto,
  ): Promise<Subcontractor> {
    const subcontractor = this.subcontractorRepository.create(
      createSubcontractorDto,
    );
    return this.subcontractorRepository.save(subcontractor);
  }

  async update(
    id: number,
    updateSubcontractorDto: UpdateSubcontractorDto,
  ): Promise<Subcontractor> {
    const subcontractor = await this.findById(id);
    const updatedSubcontractor = Object.assign(
      subcontractor,
      updateSubcontractorDto,
    );
    return this.subcontractorRepository.save(updatedSubcontractor);
  }

  async delete(id: number): Promise<void> {
    const subcontractor = await this.findById(id);
    await this.subcontractorRepository.remove(subcontractor);
  }
}
