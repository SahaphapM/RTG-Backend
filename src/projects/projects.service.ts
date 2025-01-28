import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { ProjectItem } from './entities/project-item.entity';
import { Item } from 'src/items/entities/item.entity';
import { plainToInstance } from 'class-transformer';

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

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['customer'],
    });
  }

  async findById(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { projectItems: { item: true }, customer: true },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
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
        ), // Calculate total price
      });
      projectItemsList.push(newProjectItem);
    }

    // Create and save Project
    const project = this.projectRepository.create({
      ...projectData,
      customer,
      projectItems: projectItemsList,
    });
    return this.projectRepository.save(project);
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
