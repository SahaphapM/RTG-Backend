import { Customer } from 'src/customers/entities/customer.entity';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('PurchaseOrder')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 16 })
  number: string; // Purchase order number

  @ManyToOne(() => Subcontractor, (subcontractor) => subcontractor.id, {
    nullable: false,
  })
  subcontractor: Subcontractor; // Foreign Key: Subcontractor for the purchase order

  @Column({ type: 'varchar', length: 255 })
  description: string; // Description of the purchase order

  @Column({ type: 'date' })
  date: Date; // Date of the purchase order

  @ManyToOne(() => Customer, (customer) => customer.id, { nullable: false })
  customer: Customer; // Foreign Key: Customer associated with the purchase order

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
