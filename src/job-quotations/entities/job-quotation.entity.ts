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
import { Payment } from './payment.entity';

@Entity('JobQuotation')
export class JobQuotation {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string; // Description of the job quotation

  @Column({ type: 'varchar', length: 16, nullable: true })
  customerRef: string; // Reference to the customer

  @Column({ type: 'varchar', length: 55, nullable: true })
  paymentTerms: string; // Payment terms for the job quotation

  @Column({ type: 'varchar', length: 55, nullable: true })
  deliveryTime: string; // Delivery time for the job quotation

  @Column({ type: 'varchar', length: 55, nullable: true })
  deliveryPlace: string; // Delivery place for the job quotation

  @Column({ type: 'decimal', nullable: true })
  vatPercentage: number; // VAT percentage for the job quotation

  @Column({ type: 'varchar', length: 55, nullable: true })
  bestRegards: string; // Best regards for the job quotation

  @Column({ type: 'decimal', nullable: true })
  priceOffered: number; // Total amount for the job quotation

  @Column({ type: 'varchar', length: 255, nullable: true }) // Message for the job quotation
  message: string;

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

  @OneToMany(() => Payment, (payment) => payment.jobQuotation)
  payments: Payment[];
}

export enum PaymentMethods {
  CASH = 'Cash',
  CHECK = 'Check',
  CREDIT_CARD = 'Credit Card',
  Installment = 'Installment',
}
