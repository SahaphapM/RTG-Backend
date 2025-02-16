import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import { OrderDetail } from './entities/orderDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      Subcontractor,
      Customer,
      OrderDetail,
    ]),
  ],
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}
