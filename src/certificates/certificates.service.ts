import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Repository } from 'typeorm';
import path from 'path';
import * as fs from 'fs';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import { Project } from 'src/projects/entities/project.entity';

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
      const project = await this.projectRepository.findOne({
        where: { id: createCertificateDto.projectId },
      });

      const subcontractor = await this.subcontractorRepository.findOne({
        where: { id: createCertificateDto.subcontractorId },
      });

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

  findAll() {
    try {
      return this.certificateRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching certificates: ' + error.message,
      );
    }
  }

  findOne(id: number) {
    try {
      return this.certificateRepository.findOne({ where: { id } });
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
