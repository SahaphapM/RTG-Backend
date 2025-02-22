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
import { Invoice } from './invoice.entity';

@Entity('JobQuotation')
export class JobQuotation {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string; // Description of the job quotation

  @Column({ type: 'varchar', length: 16, nullable: true })
  ourRef: string;

  @Column({ type: 'varchar', length: 55, nullable: true })
  invoiceTerms: string; // Invoice terms for the job quotation

  @Column({ type: 'varchar', length: 55, nullable: true })
  deliveryTime: string; // Delivery time for the job quotation

  @Column({ type: 'varchar', length: 55, nullable: true })
  deliveryPlace: string; // Delivery place for the job quotation

  @Column({ type: 'decimal', nullable: true })
  vatPercentage: number; // VAT percentage for the job quotation

  @Column({ type: 'decimal', nullable: true })
  priceOffered: number; // Total amount for the job quotation

  @Column({ type: 'varchar', length: 255, nullable: true }) // Message for the job quotation
  message: string;

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated

  @Column({ type: 'varchar', length: 16, nullable: true })
  invoiceMethod: string | null; // Invoice method for the project

  @ManyToOne(() => Project, (project) => project.jobQuotations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project: Project; // Foreign Key: Project associated with the quotation

  @OneToMany(() => Invoice, (invoice) => invoice.jobQuotation, {
    nullable: true,
    cascade: true,
  })
  invoices: Invoice[];
}

export enum InvoiceMethods {
  CASH = 'Cash',
  CHECK = 'Check',
  CREDIT_CARD = 'Credit Card',
  Installment = 'Installment',
}
