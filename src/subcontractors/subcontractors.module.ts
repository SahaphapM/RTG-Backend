import { Module } from '@nestjs/common';
import { SubcontractorsService } from './subcontractors.service';
import { SubcontractorsController } from './subcontractors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcontractor } from './entities/subcontractor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subcontractor])],
  controllers: [SubcontractorsController],
  providers: [SubcontractorsService],
})
export class SubcontractorsModule {}
