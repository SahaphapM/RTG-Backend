import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { ProjectItem } from './entities/project-item.entity';
import { Item } from 'src/items/entities/item.entity';
import { plainToInstance } from 'class-transformer';
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

      const whereCondition = search
        ? [
            { number: Like(`%${search}%`) }, // Match number
            { name: Like(`%${search}%`) }, // Match name
            { customer: { name: Like(`%${search}%`) } }, // Match subcontractor name
          ]
        : [];

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
        projectItems: { item: true },
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
      const { customerId, projectItems, ...projectData } = createProjectDto;

      // Validate customer
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }

      // Validate items and prepare ProjectItems
      const projectItemsList: ProjectItem[] = [];
      for (const projectItem of projectItems) {
        const item = await this.itemRepository.findOne({
          where: { id: projectItem.itemId },
        });
        if (!item) {
          throw new NotFoundException(
            `Item with ID ${projectItem.itemId} not found`,
          );
        }

        const newProjectItem = await this.projectItemRepository.save({
          item,
          quantity: projectItem.quantity,
          price: projectItem.price,
          totalPrice: calculateTotalPrice(
            projectItem.price,
            projectItem.quantity,
          ),
        });
        projectItemsList.push(newProjectItem);
      }

      // Create and save Project
      const project = this.projectRepository.create({
        ...projectData,
        customer,
        projectItems: projectItemsList,
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
    const { customerId, projectItems, ...projectData } = updateProjectDto;

    // Find existing project with projectItems and customer
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['projectItems', 'customer', 'projectItems.item'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Validate customer if changed
    if (customerId && project.customer.id !== customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }
      project.customer = customer;
    }

    // Delete all existing ProjectItems for this project
    await this.projectItemRepository.delete({ project: { id } });

    // Prepare new ProjectItems
    let totalProjectPrice = 0;
    const newProjectItems: ProjectItem[] = [];

    for (const dto of projectItems) {
      const item = await this.itemRepository.findOne({
        where: { id: dto.itemId },
      });
      if (!item) {
        throw new NotFoundException(`Item with ID ${dto.itemId} not found`);
      }

      const totalPrice = dto.price * dto.quantity; // Use dto.price for custom price
      totalProjectPrice += totalPrice;

      newProjectItems.push(
        this.projectItemRepository.create({
          project,
          item,
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
  }

  async delete(id: number): Promise<void> {
    const project = await this.findById(id);
    await this.projectRepository.remove(project);
  }
}

function calculateTotalPrice(price: number, quantity: number): number | null {
  if (!price || !quantity) return null;

  return price * quantity;
}
