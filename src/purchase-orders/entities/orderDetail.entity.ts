// import {
//   Column,
//   Entity,
//   ManyToOne,
//   OneToMany,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Payment } from './payment.entity';

// @Entity('paymentDetail')
// export class PaymentDetail {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'varchar', length: 255 })
//   description: string;

//   @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
//   unitPrice: number;

//   @Column({ type: 'int', nullable: true })
//   qty: number;

//   @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
//   total: number;

//   @ManyToOne(() => Payment, (payment) => payment.paymentDetails, {
//     onDelete: 'CASCADE',
//   })
//   payment: Payment;
// }

// order detail

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('OrderDetail')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number;

  @Column({ type: 'int', nullable: true })
  qty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total: number;

  @ManyToOne(
    () => PurchaseOrder,
    (purchaseOrder) => purchaseOrder.orderDetails,
    {
      onDelete: 'CASCADE',
    },
  )
  purchaseOrder: PurchaseOrder;
}
