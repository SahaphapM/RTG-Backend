import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { QueryDto } from 'src/paginations/pagination.dto';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: QueryDto) {
    try {
      return await this.purchaseOrdersService.findAll(query);
    } catch (error) {
      console.log(error);
    }
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
