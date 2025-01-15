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

@Entity('JobQuotation')
export class JobQuotation {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @ManyToOne(() => Customer, (customer) => customer.id, { nullable: false })
  customer: Customer; // Foreign Key: Customer associated with the quotation

  @ManyToOne(() => Project, (project) => project.id, { nullable: false })
  project: Project; // Foreign Key: Project associated with the quotation

  @Column({ type: 'date' })
  date: Date; // Date of the job quotation

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
