import { Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}
  async create(
    createCertificateDto: CreateCertificateDto,
    filename: string,
  ): Promise<Certificate> {
    const certificate = this.certificateRepository.create({
      ...createCertificateDto,
      file: filename, // Store uploaded filename
    });

    return await this.certificateRepository.save(certificate);
  }

  async saveCertificate(filename: string): Promise<Certificate> {
    const certificate = this.certificateRepository.create({ file: filename });
    return await this.certificateRepository.save(certificate);
  }

  findAll() {
    return this.certificateRepository.find();
  }

  findOne(id: number) {
    try {
      return this.certificateRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(
        'Certificate not found with this id: ' + id + 'error : ' + error,
      );
    }
  }

  update(id: number, updateCertificateDto: UpdateCertificateDto) {
    return `This action updates a #${id} certificate`;
  }

  remove(id: number) {
    return `This action removes a #${id} certificate`;
  }
}
