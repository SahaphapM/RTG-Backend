import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Subcontractor')
export class Subcontractor {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 32 })
  name: string; // Name of the subcontractor

  @Column({ type: 'varchar', length: 24 })
  type: string; // Type of subcontractor (e.g., supplier, contractor)

  @Column({ type: 'varchar', length: 255 })
  address: string; // Address of the subcontractor

  @Column({ type: 'varchar', length: 64 })
  contact: string; // Contact information

  @Column({ type: 'varchar', length: 64, nullable: true })
  email: string; // Optional email for communication

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Whether the subcontractor is active or inactive

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
