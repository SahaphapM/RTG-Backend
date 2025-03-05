import { Customer } from 'src/customers/entities/customer.entity';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderDetail } from './orderDetail.entity';

@Entity('PurchaseOrder')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 16, nullable: true })
  number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  qtNumber: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  taxId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ourRef: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file: string;

  @Column({ type: 'date', nullable: true })
  shippedDate: Date;

  @ManyToOne(
    () => Subcontractor,
    (subcontractor) => subcontractor.purchaseOrders,
    {
      nullable: true,
    },
  )
  subcontractor: Subcontractor;

  @ManyToOne(() => Customer, (customer) => customer.purchaseOrders, {
    nullable: true,
  })
  customer: Customer;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.purchaseOrder, {
    cascade: true,
  })
  orderDetails: OrderDetail[];

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
  discount: number;

  @Column({ type: 'int', scale: 2, nullable: true })
  vat: number;
}
