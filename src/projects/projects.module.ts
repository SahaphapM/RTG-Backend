import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { ProjectItem } from './entities/project-item.entity';
import { Item } from 'src/items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectItem, Item, Customer])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
