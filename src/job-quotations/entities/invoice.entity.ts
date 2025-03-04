import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { JobQuotation } from './job-quotation.entity';
import { InvoiceDetail } from './invoiceDetail.entity';

@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'varchar', length: 16, nullable: true })
  ourTax: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  cusTax: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  taxInvoice: string;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

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

  @Column({ type: 'varchar', length: 16, nullable: true })
  invoiceTerms: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  ourRef: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bank: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  branch: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  accountName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  accountNumber: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  swift: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  receivedBy: string;

  @Column({ type: 'date', nullable: true })
  receivedDate: Date;

  // ✅ Relation to JobQuotation (Many Invoices belong to One JobQuotation)
  @ManyToOne(() => JobQuotation, (jobQuotation) => jobQuotation.invoices, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  jobQuotation: JobQuotation;

  // ✅ Relation to InvoiceDetails (One Invoice has Many InvoiceDetails)
  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.invoice, {
    nullable: true,
    cascade: true,
  })
  invoiceDetails: InvoiceDetail[];
}
