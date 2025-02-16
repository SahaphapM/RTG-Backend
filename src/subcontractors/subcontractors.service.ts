import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      return await this.subcontractorRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch subcontractors' + error.message,
      );
    }
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
    try {
      const subcontractor = this.subcontractorRepository.create(
        createSubcontractorDto,
      );
      return await this.subcontractorRepository.save(subcontractor);
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate entry (e.g., unique constraint violation)
        throw new BadRequestException(
          'Subcontractor already exists' + error.message,
        );
      }
      throw new InternalServerErrorException(
        'Failed to create subcontractor' + error.message,
      );
    }
  }

  async update(
    id: number,
    updateSubcontractorDto: UpdateSubcontractorDto,
  ): Promise<Subcontractor> {
    try {
      const subcontractor = await this.findById(id);
      const updatedSubcontractor = Object.assign(
        subcontractor,
        updateSubcontractorDto,
      );
      return await this.subcontractorRepository.save(updatedSubcontractor);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update subcontractor' + error.message,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const subcontractor = await this.findById(id);
      await this.subcontractorRepository.remove(subcontractor);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete subcontractor' + error.message,
      );
    }
  }
}
