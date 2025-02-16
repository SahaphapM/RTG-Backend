import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrder } from './entities/purchase-order.entity';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}
  @Get()
  async findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.findById(id);
  }

  @Post()
  async create(
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.create(createPurchaseOrderDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.update(id, updatePurchaseOrderDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.purchaseOrdersService.delete(id);
  }
}
