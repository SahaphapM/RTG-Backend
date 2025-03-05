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

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value, // แปลงเป็นค่าเดิมก่อนบันทึกลง DB
      from: (value: string) => parseFloat(value), // แปลงกลับเป็น number เมื่อดึงจาก DB
    },
  })
  unitPrice: number;

  @Column({ type: 'int', nullable: true })
  qty: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value, // แปลงเป็นค่าเดิมก่อนบันทึกลง DB
      from: (value: string) => parseFloat(value), // แปลงกลับเป็น number เมื่อดึงจาก DB
    },
  })
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
