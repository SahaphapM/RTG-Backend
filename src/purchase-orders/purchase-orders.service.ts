// src/purchase-order/purchase-order.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import { Customer } from 'src/customers/entities/customer.entity';

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

  async findAll(): Promise<PurchaseOrder[]> {
    try {
      return await this.purchaseOrderRepository.find({
        relations: {
          subcontractor: true,
          customer: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch purchase orders' + error.message,
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
}
