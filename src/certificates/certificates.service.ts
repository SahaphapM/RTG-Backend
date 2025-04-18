import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Like, Repository } from 'typeorm';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import { Project } from 'src/projects/entities/project.entity';
import { QueryDto } from 'src/paginations/pagination.dto';
import * as moment from 'moment';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(Subcontractor)
    private readonly subcontractorRepository: Repository<Subcontractor>,
  ) {}
  async create(
    createCertificateDto: CreateCertificateDto,
  ): Promise<Certificate> {
    try {
      const { project, subcontractor } = createCertificateDto;

      if (project) {
        const existingProject = await this.projectRepository.findOne({
          where: { id: createCertificateDto.project.id },
        });
        if (!existingProject) {
          throw new NotFoundException(
            `Project with ID ${createCertificateDto.project.id} not found`,
          );
        }
      }

      if (subcontractor) {
        const existingSubcontractor =
          await this.subcontractorRepository.findOne({
            where: { id: createCertificateDto.subcontractor.id },
          });
        if (!existingSubcontractor) {
          throw new NotFoundException(
            `Subcontractor with ID ${createCertificateDto.subcontractor.id} not found`,
          );
        }
      }

      const certificate = this.certificateRepository.create({
        ...createCertificateDto,
        file: '', // ยังไม่บันทึกไฟล์ในตอนนี้
        project,
        subcontractor,
      });

      return await this.certificateRepository.save(certificate);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating certificate: ${error.message}`,
      );
    }
  }

  async updateFile(id: number, filename: string): Promise<Certificate> {
    try {
      const certificate = await this.certificateRepository.findOne({
        where: { id },
      });

      if (!certificate) {
        throw new NotFoundException(`Certificate with id ${id} not found`);
      }

      certificate.file = filename;
      return await this.certificateRepository.save(certificate);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating file for certificate id ${id}: ${error.message}`,
      );
    }
  }
  async findAll(query: QueryDto) {
    const { page, limit, search, sortBy, order } = query;
    console.log(query);

    const whereCondition = search
      ? [
          { name: Like(`%${search}%`) },
          { description: Like(`%${search}%`) },
          { subcontractor: { name: Like(`%${search}%`) } },
          { project: { name: Like(`%${search}%`) } },
        ]
      : [];

    const [data, total] = await this.certificateRepository.findAndCount({
      where: whereCondition.length > 0 ? whereCondition : {}, // Apply OR condition if search exists
      order: { [sortBy]: order }, // Sorting
      skip: (page - 1) * limit, // Pagination start index
      take: limit, // Number of results per page
      relations: {
        subcontractor: true,
        project: true,
      },
      select: {
        subcontractor: { name: true },
        project: { name: true },
      },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    try {
      return this.certificateRepository.findOne({
        where: { id },
        relations: { project: true, subcontractor: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Certificate not found with this id: ' +
          id +
          'error : ' +
          error.message,
      );
    }
  }

  async update(
    id: number,
    updateCertificateDto: UpdateCertificateDto,
  ): Promise<Certificate> {
    try {
      const { project, subcontractor, ...rest } = updateCertificateDto;

      if (project) {
        const existingProject = await this.projectRepository.findOne({
          where: { id: project.id },
        });
        if (!existingProject) {
          throw new NotFoundException(
            `Project with ID ${project.id} not found`,
          );
        }
      }

      if (subcontractor) {
        const existingSubcontractor =
          await this.subcontractorRepository.findOne({
            where: { id: subcontractor.id },
          });
        if (!existingSubcontractor) {
          throw new NotFoundException(
            `Subcontractor with ID ${subcontractor.id} not found`,
          );
        }
      }

      const certificate = await this.certificateRepository.findOne({
        where: { id },
      });

      if (!certificate) {
        throw new NotFoundException(`Certificate with id ${id} not found`);
      }

      const updatedCertificate = Object.assign(
        certificate,
        updateCertificateDto,
      );
      return await this.certificateRepository.save(updatedCertificate);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating certificate with id ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: number): Promise<{ message: string; file: string }> {
    try {
      const certificate = await this.certificateRepository.findOne({
        where: { id },
      });

      if (!certificate) {
        throw new NotFoundException(`Certificate with id ${id} not found`);
      }

      // ลบ record จากฐานข้อมูล
      await this.certificateRepository.remove(certificate);
      return {
        message: `Certificate with id ${id} and its file have been removed successfully`,
        file: certificate.file,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error removing certificate with id ${id}: ${error.message}`,
      );
    }
  }
}
