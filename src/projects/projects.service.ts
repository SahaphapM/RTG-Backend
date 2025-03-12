import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Project } from './entities/project.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { ProjectItem } from './entities/project-item.entity';
import { Item } from 'src/items/entities/item.entity';
import { QueryDto } from 'src/paginations/pagination.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectItem)
    private projectItemRepository: Repository<ProjectItem>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findAll(query: QueryDto) {
    try {
      const { page, limit, search, sortBy, order } = query;

      const searchValue = isNaN(Number(search)) ? null : Number(search);

      const whereCondition = [
        { number: Like(`%${search}%`) }, // ค้นหาเลขโครงการ
        { name: Like(`%${search}%`) }, // ค้นหาชื่อโครงการ
        ...(searchValue !== null ? [{ totalProjectPrice: searchValue }] : []), // ค้นหาราคาที่ตรงกัน
        { customer: { name: Like(`%${search}%`) } }, // ค้นหาชื่อลูกค้า
      ];

      const [data, total] = await this.projectRepository.findAndCount({
        where: whereCondition.length > 0 ? whereCondition : {}, // Apply OR condition if search exists
        order: { [sortBy]: order }, // Sorting
        skip: (page - 1) * limit, // Pagination start index
        take: limit, // Number of results per page
        relations: {
          customer: true,
        },
      });

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch purchase orders: ' + error.message,
      );
    }
  }

  async findById(id: number): Promise<Project> {
    console.log('project', id);
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: {
        projectItems: true,
        customer: true,
        jobQuotations: true,
      },
    });
    console.log('project', project.jobQuotations);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const { customer, projectItems, ...projectData } = createProjectDto;

      // Validate customer

      if (customer) {
        const existingCustomer = await this.customerRepository.findOne({
          where: { id: customer.id },
        });
        if (!existingCustomer) {
          throw new NotFoundException(
            `Customer with ID ${customer.id} not found`,
          );
        }
      }

      // Validate items and prepare ProjectItems
      const projectItemsList: ProjectItem[] = [];
      for (const projectItem of projectItems) {
        const newProjectItem = await this.projectItemRepository.save({
          name: projectItem.name,
          quantity: projectItem.quantity,
          price: projectItem.price,
          totalPrice: calculateTotalPrice(
            projectItem.price,
            projectItem.quantity,
          ),
        });
        projectItemsList.push(newProjectItem);
      }

      // Calculate total price
      const totalPrice = projectItemsList.reduce(
        (total, projectItem) => total + projectItem.totalPrice,
        0,
      );

      // Create and save Project
      const project = this.projectRepository.create({
        ...projectData,
        customer,
        projectItems: projectItemsList,
        totalProjectPrice: totalPrice,
      });

      return await this.projectRepository.save(project);
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Error creating project:', error.message);

      // Return a specific error message based on the error type
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException(
          'An unexpected error occurred while creating the project',
        );
      }
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const { projectItems, ...projectData } = updateProjectDto;

    // Find existing project with projectItems and customer
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { projectItems: true, customer: true },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    try {
      // Delete all existing ProjectItems for this project
      await this.projectItemRepository.delete({ project: { id } });

      // Prepare new ProjectItems
      let totalProjectPrice = 0;
      const newProjectItems: ProjectItem[] = [];

      for (const dto of projectItems) {
        const totalPrice = dto.price * dto.quantity; // Use dto.price for custom price
        totalProjectPrice += totalPrice;

        newProjectItems.push(
          this.projectItemRepository.create({
            project,
            name: dto.name,
            price: dto.price,
            quantity: dto.quantity,
            totalPrice,
          }),
        );
      }

      // Save all new ProjectItems
      project.projectItems =
        await this.projectItemRepository.save(newProjectItems);

      // Update project fields
      Object.assign(project, projectData);
      project.totalProjectPrice = totalProjectPrice;

      // Save updated project
      return this.projectRepository.save(project);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update project: ' + error.message,
      );
    }
  }

  async delete(id: number) {
    try {
      await this.projectRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete project: ' + error.message,
      );
    }
  }
}

function calculateTotalPrice(price: number, quantity: number): number | null {
  if (!price || !quantity) return null;

  return price * quantity;
}
