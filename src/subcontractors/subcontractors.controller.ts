import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubcontractorsService } from './subcontractors.service';
import { CreateSubcontractorDto } from './dto/create-subcontractor.dto';
import { UpdateSubcontractorDto } from './dto/update-subcontractor.dto';
import { Subcontractor } from './entities/subcontractor.entity';
import { QueryDto } from 'src/paginations/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('subcontractors')
export class SubcontractorsController {
  constructor(private readonly subcontractorService: SubcontractorsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllSubcontractors(@Query() query: QueryDto) {
    return this.subcontractorService.findAll(query);
  }

  @Get(':id')
  async getSubcontractorById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Subcontractor> {
    return this.subcontractorService.findById(id);
  }

  @Post()
  async createSubcontractor(
    @Body() createSubcontractorDto: CreateSubcontractorDto,
  ): Promise<Subcontractor> {
    return this.subcontractorService.create(createSubcontractorDto);
  }

  @Patch(':id')
  async updateSubcontractor(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubcontractorDto: UpdateSubcontractorDto,
  ): Promise<Subcontractor> {
    return this.subcontractorService.update(id, updateSubcontractorDto);
  }

  @Delete(':id')
  async deleteSubcontractor(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.subcontractorService.delete(id);
  }
}
