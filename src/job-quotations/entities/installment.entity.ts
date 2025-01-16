import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobQuotation } from './job-quotation.entity';

@Entity('Installment')
export class Installment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'date', nullable: true })
  paidDate: Date;

  @ManyToOne(() => JobQuotation, (jobQuotation) => jobQuotation.installments)
  jobQuotation: JobQuotation;
}
