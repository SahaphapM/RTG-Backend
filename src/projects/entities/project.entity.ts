import { Customer } from 'src/customers/entities/customer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 32 })
  name: string; // Name of the project

  @ManyToOne(() => Customer, (customer) => customer.id, { nullable: false })
  customer: Customer; // Foreign Key: Customer associated with the project

  @Column({ type: 'varchar', length: 16 })
  number: string; // Project number

  @Column({ type: 'date' })
  startDate: Date; // Start date of the project

  @Column({ type: 'date' })
  endDate: Date; // End date of the project

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
