import { Project } from 'src/projects/entities/project.entity';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('Certificate')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 255 })
  description: string; // Description of the certificate

  @Column({ type: 'varchar', length: 64 })
  name: string; // Name of the certificate

  @Column({ type: 'varchar', length: 64 })
  type: string; // Type of the certificate

  @Column({ type: 'varchar', length: 255 })
  file: string; // File path of the certificate

  @ManyToOne(() => Project, (project) => project.id, { nullable: false })
  project: Project; // Foreign Key: Project associated with the certificate

  @ManyToOne(() => Subcontractor, (subcontractor) => subcontractor.id, {
    nullable: false,
  })
  subcontractor: Subcontractor; // Foreign Key: Subcontractor providing the certificate
}
