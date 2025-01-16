import { Customer } from 'src/customers/entities/customer.entity';
import { Project } from 'src/projects/entities/project.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Installment } from './installment.entity';

@Entity('JobQuotation')
export class JobQuotation {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'date' })
  date: Date; // Date of the job quotation

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated

  @Column({ type: 'varchar', length: 16, nullable: true })
  paymentMethod: string | null; // Payment method for the project

  @ManyToOne(() => Project, (project) => project.jobQuotations, {
    nullable: false,
  })
  project: Project; // Foreign Key: Project associated with the quotation

  @OneToMany(() => Installment, (installment) => installment.jobQuotation)
  installments: Installment[];
}

export enum PaymentMethods {
  CASH = 'Cash',
  CHECK = 'Check',
  CREDIT_CARD = 'Credit Card',
  Installment = 'Installment',
}
