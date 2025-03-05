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
            { name: Like(`%${search}%`) }, // Match number
            { subcontractor: { name: Like(`%${search}%`) } }, // Match subcontractor name
            { number: Like(`%${search}%`) },
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
    console.log('updateFile', id, filename);

    if (isNaN(id)) {
      throw new BadRequestException('Invalid ID: ID must be a number');
    }

    try {
      const purchaseOrder = await this.purchaseOrderRepository.findOne({
        where: { id },
      });
      console.log('Found PurchaseOrder:', purchaseOrder); // ✅ ตรวจสอบค่า
      if (!purchaseOrder) {
        throw new NotFoundException(`PurchaseOrder with id ${id} not found`);
      }

      return await this.purchaseOrderRepository.save({
        ...purchaseOrder,
        file: filename,
      });
    } catch (error) {
      console.error('Backend log Error updating file :', error);
      throw new InternalServerErrorException(
        `Error updating file for PurchaseOrder id ${id}: ${error.message}`,
      );
    }
  }

  async create(
    createPurchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    console.log('createPurchaseOrderDto', createPurchaseOrderDto);
    try {
      const { subcontractor, customer, ...rest } = createPurchaseOrderDto;

      // Find subcontractor
      if (subcontractor) {
        const existingSubcontractor =
          await this.subcontractorRepository.findOne({
            where: { id: subcontractor.id },
          });
        if (!existingSubcontractor) {
          throw new NotFoundException(
            `Subcontractor with ID ${subcontractor.id} not found`,
          );
        }
      }

      // Find customer
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

      // Get the new PO number
      const newPONumber = await this.generatePONumber(); // Call the function to generate PO number

      // Create purchase order
      const purchaseOrder = await this.purchaseOrderRepository.save({
        ...rest,
        subcontractor,
        customer,
        number: newPONumber,
      });

      return purchaseOrder;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create purchase order: ${error.message}`,
      );
    }
  }

  async update(
    id: number,
    updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    try {
      const purchaseOrder = await this.findById(id);
      const { subcontractor, customer, ...rest } = updatePurchaseOrderDto;

      // Update subcontractor (if provided)
      if (subcontractor !== undefined) {
        purchaseOrder.subcontractor =
          await this.subcontractorRepository.findOne({
            where: { id: subcontractor.id },
          });
        if (!purchaseOrder.subcontractor) {
          throw new NotFoundException(
            `Subcontractor with ID ${subcontractor.id} not found`,
          );
        }
      }

      // Update customer (if provided)
      if (customer !== undefined) {
        purchaseOrder.customer = await this.customerRepository.findOne({
          where: { id: customer.id },
        });
        if (!purchaseOrder.customer) {
          throw new NotFoundException(
            `Customer with ID ${customer.id} not found`,
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

  async generatePONumber(): Promise<string> {
    try {
      const currentYear = new Date().getFullYear().toString();

      // Query the latest PO number for the current year
      const lastPO = await this.purchaseOrderRepository.findOne({
        where: {
          number: Like(`%/${currentYear}`), // ✅ Look for any number pattern in the current year
        },
        order: {
          number: 'DESC',
        },
      });

      let newPONumber: string;
      // Extract the last number part and increment it
      if (lastPO) {
        const lastNumberString = lastPO.number.split('/')[0].replace(/\D/g, ''); // ✅ Remove all non-numeric characters
        const lastNumber = parseInt(lastNumberString, 10) || 0; // ✅ Ensure a valid number, default to 0
        // Generate the new PO number (without "PO" prefix)
        newPONumber = `${String(lastNumber + 1).padStart(3, '0')}/${currentYear}`;
      } else {
        // ✅ ถ้ายังไม่มีเลข PO มาก่อน ให้เริ่มที่ `001`
        newPONumber = `001/${currentYear}`;
      }

      return newPONumber;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to generate PO number: ${error.message}`,
      );
    }
  }
}
