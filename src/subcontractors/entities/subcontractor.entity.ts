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

  @Column({ type: 'varchar', length: 24, nullable: true })
  type: string | null; // Type of subcontractor (e.g., supplier, contractor), can be null

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null; // Address of the subcontractor, can be null

  @Column({ type: 'varchar', length: 64, nullable: true })
  contact: string | null; // Contact information, can be null

  @Column({ type: 'varchar', length: 64, nullable: true })
  email: string | null; // Optional email for communication, can be null

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
