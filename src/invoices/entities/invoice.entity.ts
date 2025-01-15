import { Customer } from 'src/customers/entities/customer.entity';
import { Project } from 'src/projects/entities/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Invoice')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @ManyToOne(() => Customer, (customer) => customer.id, { nullable: false })
  customer: Customer; // Foreign Key: Customer associated with the invoice

  @ManyToOne(() => Project, (project) => project.id, { nullable: false })
  project: Project; // Foreign Key: Project associated with the invoice

  @Column({ type: 'varchar', length: 16 })
  number: string; // Invoice number

  @Column({ type: 'date' })
  date: Date; // Date of the invoice

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
