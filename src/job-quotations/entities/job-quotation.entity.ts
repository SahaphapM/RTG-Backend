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

  @Column({ type: 'text', nullable: true })
  description: string; // Description of the job quotation

  @Column({ type: 'varchar', length: 55, nullable: true })
  ourRef: string;

  @Column({ type: 'text', nullable: true })
  invoiceTerms: string; // Invoice terms for the job quotation

  @Column({ type: 'text', nullable: true })
  deliveryTime: string; // Delivery time for the job quotation

  @Column({ type: 'text', nullable: true })
  deliveryPlace: string; // Delivery place for the job quotation

  @Column({ type: 'int', nullable: true })
  vatPercentage: number; // VAT percentage for the job quotation

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
  priceOffered: number; // Total amount for the job quotation

  @Column({ type: 'text', nullable: true }) // Message for the job quotation
  message: string;

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated

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
