import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobQuotation } from './job-quotation.entity';
import { PaymentDetail } from './paymentDetail.entity';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', nullable: true })
  price: number;

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

  @ManyToOne(() => JobQuotation, (jobQuotation) => jobQuotation.payments)
  jobQuotation: JobQuotation;

  @OneToMany(() => PaymentDetail, (paymentDetail) => paymentDetail.payment)
  paymentDetails: PaymentDetail[];
}
