import { Project } from 'src/projects/entities/project.entity';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Certificate')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @ManyToOne(() => Subcontractor, (subcontractor) => subcontractor.id, {
    nullable: false,
  })
  subcontractor: Subcontractor; // Foreign Key: Subcontractor providing the certificate

  @ManyToOne(() => Project, (project) => project.id, { nullable: false })
  project: Project; // Foreign Key: Project associated with the certificate

  @Column({ type: 'varchar', length: 64 })
  type: string; // Type of the certificate

  @Column({ type: 'varchar', length: 255 })
  description: string; // Description of the certificate

  @Column({ type: 'varchar', length: 64 })
  name: string; // Name of the certificate

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
