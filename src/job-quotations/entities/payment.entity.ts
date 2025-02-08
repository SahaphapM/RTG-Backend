import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { JobQuotation } from './job-quotation.entity';
import { PaymentDetail } from './paymentDetail.entity';

@Entity('payment')
export class Payment {
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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total: number;

  @Column({ type: 'varchar', length: 16, nullable: true })
  paymentTerms: string;

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

  // ✅ Relation to JobQuotation (Many Payments belong to One JobQuotation)
  @ManyToOne(() => JobQuotation, (jobQuotation) => jobQuotation.payments, {
    onDelete: 'CASCADE',
  })
  jobQuotation: JobQuotation;

  // ✅ Relation to PaymentDetails (One Payment has Many PaymentDetails)
  @OneToMany(() => PaymentDetail, (paymentDetail) => paymentDetail.payment)
  paymentDetails: PaymentDetail[];
}
