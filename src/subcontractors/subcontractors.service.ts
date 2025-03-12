import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Subcontractor } from './entities/subcontractor.entity';
import { CreateSubcontractorDto } from './dto/create-subcontractor.dto';
import { UpdateSubcontractorDto } from './dto/update-subcontractor.dto';
import { QueryDto } from 'src/paginations/pagination.dto';

@Injectable()
export class SubcontractorsService {
  constructor(
    @InjectRepository(Subcontractor)
    private subcontractorRepository: Repository<Subcontractor>,
  ) {}

  async findAll(query: QueryDto) {
    const { page, limit, search, sortBy, order } = query;

    const [data, total] = await this.subcontractorRepository.findAndCount({
      where: search
        ? [
            { name: Like(`%${search}%`) },
            { email: Like(`%${search}%`) },
            { contact: Like(`%${search}%`) },
            { description: Like(`%${search}%`) },
          ]
        : {},
      order: { [sortBy]: order }, // Sorting
      skip: (page - 1) * limit, // Pagination start index
      take: limit, // Number of results per page
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
