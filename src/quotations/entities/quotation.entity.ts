import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Quotation')
export class Quotation {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @ManyToOne(() => Subcontractor, (subcontractor) => subcontractor.id, {
    nullable: false,
  })
  subcontractor: Subcontractor; // Foreign Key: Subcontractor providing the quotation

  @Column({ type: 'varchar', length: 16 })
  number: string; // Quotation number

  @Column({ type: 'varchar', length: 255 })
  description: string; // Description of the quotation

  @Column({ type: 'date' })
  date: Date; // Date of the quotation

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
