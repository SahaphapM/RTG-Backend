// src/purchase-order/purchase-order.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { QueryDto } from 'src/paginations/pagination.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(Subcontractor)
    private readonly subcontractorRepository: Repository<Subcontractor>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(query: QueryDto) {
    try {
      const { page, limit, search, sortBy, order } = query;

      const whereCondition = search
        ? [
            { number: Like(`%${search}%`) }, // Match number
            { subcontractor: { name: Like(`%${search}%`) } }, // Match subcontractor name
          ]
        : [];

      const [data, total] = await this.purchaseOrderRepository.findAndCount({
        where: whereCondition.length > 0 ? whereCondition : {}, // Apply OR condition if search exists
        order: { [sortBy]: order }, // Sorting
        skip: (page - 1) * limit, // Pagination start index
        take: limit, // Number of results per page
        relations: {
          subcontractor: true,
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

  async findById(id: number): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: {
        subcontractor: true,
        customer: true,
        orderDetails: true,
      },
    });
    if (!purchaseOrder) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }
    return purchaseOrder;
  }

  async updateFile(id: number, filename: string): Promise<PurchaseOrder> {
    try {
      const purchaseOrder = await this.purchaseOrderRepository.findOne({
        where: { id },
      });

      if (!purchaseOrder) {
        throw new NotFoundException(`PurchaseOrder with id ${id} not found`);
      }

      purchaseOrder.file = filename;
      return await this.purchaseOrderRepository.save(purchaseOrder);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating file for PurchaseOrder id ${id}: ${error.message}`,
      );
    }
  }

  async create(
    createPurchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    try {
      const { subcontractorId, customerId, ...rest } = createPurchaseOrderDto;

      // Find subcontractor (if provided)
      const subcontractor = subcontractorId
        ? await this.subcontractorRepository.findOne({
            where: { id: subcontractorId },
          })
        : null;

      // Find customer
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }

      // Create purchase order
      const purchaseOrder = this.purchaseOrderRepository.create({
        ...rest,
        subcontractor,
        customer,
      });

      return await this.purchaseOrderRepository.save(purchaseOrder);
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate entry (e.g., unique constraint violation)
        throw new BadRequestException(
          'Purchase order already exists' + error.message,
        );
      }
      throw new InternalServerErrorException(
        'Failed to create purchase order' + error.message,
      );
    }
  }

  async update(
    id: number,
    updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    try {
      const purchaseOrder = await this.findById(id);
      const { subcontractorId, customerId, ...rest } = updatePurchaseOrderDto;

      // Update subcontractor (if provided)
      if (subcontractorId !== undefined) {
        purchaseOrder.subcontractor =
          await this.subcontractorRepository.findOne({
            where: { id: subcontractorId },
          });
        if (!purchaseOrder.subcontractor) {
          throw new NotFoundException(
            `Subcontractor with ID ${subcontractorId} not found`,
          );
        }
      }

      // Update customer (if provided)
      if (customerId !== undefined) {
        purchaseOrder.customer = await this.customerRepository.findOne({
          where: { id: customerId },
        });
        if (!purchaseOrder.customer) {
          throw new NotFoundException(
            `Customer with ID ${customerId} not found`,
          );
        }
      }

      // Update other fields
      Object.assign(purchaseOrder, rest);

      return await this.purchaseOrderRepository.save(purchaseOrder);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update purchase order' + error.message,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const purchaseOrder = await this.findById(id);
      await this.purchaseOrderRepository.remove(purchaseOrder);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete purchase order' + error.message,
      );
    }
  }

  async remove(id: number): Promise<{ message: string; file: string }> {
    try {
      const purchaseOrder = await this.purchaseOrderRepository.findOne({
        where: { id },
      });

      if (!purchaseOrder) {
        throw new NotFoundException(`PurchaseOrder with id ${id} not found`);
      }

      // ลบ record จากฐานข้อมูล
      await this.purchaseOrderRepository.remove(purchaseOrder);
      return {
        message: `PurchaseOrder with id ${id} and its file have been removed successfully`,
        file: purchaseOrder.file,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error removing purchaseOrder with id ${id}: ${error.message}`,
      );
    }
  }
}
