import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Subcontractor, Project])],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
