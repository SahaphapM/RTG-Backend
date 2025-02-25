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

  @Column({ type: 'varchar', length: 16, nullable: true })
  qtNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  taxId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ourRef: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file: string;

  @ManyToOne(
    () => Subcontractor,
    (subcontractor) => subcontractor.purchaseOrders,
    {
      nullable: true,
    },
  )
  subcontractor: Subcontractor;

  @ManyToOne(() => Customer, (customer) => customer.purchaseOrders, {
    nullable: false,
  })
  customer: Customer;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.purchaseOrder, {
    cascade: true,
    eager: true,
  })
  orderDetails: OrderDetail[];

  @Column({ type: 'decimal', scale: 2, nullable: true })
  total: number;

  @Column({ type: 'decimal', scale: 2, nullable: true })
  discount: number;

  @Column({ type: 'decimal', scale: 2, nullable: true })
  vat: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
