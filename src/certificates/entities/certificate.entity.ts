import { Project } from 'src/projects/entities/project.entity';
import { Subcontractor } from 'src/subcontractors/entities/subcontractor.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('Certificate')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string; // Description of the certificate

  @Column({ type: 'varchar', length: 64, nullable: true })
  name: string; // Name of the certificate

  @Column({ type: 'date', nullable: true })
  date: Date; // Date of the certificate

  @Column({ type: 'varchar', length: 64, nullable: true })
  type: string; // Type of the certificate

  @Column({ type: 'varchar', length: 255 })
  file: string; // File path of the certificate

  @ManyToOne(() => Project, (project) => project.certificates, {
    nullable: true,
  })
  project: Project; // Foreign Key: Project associated with the certificate

  @ManyToOne(
    () => Subcontractor,
    (subcontractor) => subcontractor.certificates,
    {
      nullable: true,
    },
  )
  subcontractor: Subcontractor; // Foreign Key: Subcontractor providing the certificate
}
