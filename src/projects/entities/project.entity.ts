import { Customer } from 'src/customers/entities/customer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProjectItem } from './project-item.entity';
import { Expose } from 'class-transformer';
import { JobQuotation } from 'src/job-quotations/entities/job-quotation.entity';
import { Certificate } from 'src/certificates/entities/certificate.entity';

@Entity('Project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 32 })
  name: string; // Name of the project

  @Column({ type: 'varchar', length: 500 })
  description: string; // Description of the project

  @Column({ type: 'varchar', length: 16 })
  number: string; // Project number

  @Column({ type: 'date', nullable: true })
  startDate: Date | null; // Start date of the project, can be null

  @Column({ type: 'date', nullable: true })
  endDate: Date | null; // End date of the project, can be null

  @Column({ type: 'decimal', nullable: true })
  totalProjectPrice: number | null; // Total price of the project

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated

  @ManyToOne(() => Customer, (customer) => customer.id, { nullable: false })
  customer: Customer; // Foreign Key: Customer associated with the project

  @OneToMany(() => ProjectItem, (projectItem) => projectItem.project)
  @Expose() // Ensure projectItems are included, but without circular reference
  projectItems: ProjectItem[];

  @OneToMany(() => JobQuotation, (jobQuotation) => jobQuotation.project)
  jobQuotations: JobQuotation[];

  @OneToMany(() => Certificate, (certificate) => certificate.project)
  certificates: Certificate[];
}
