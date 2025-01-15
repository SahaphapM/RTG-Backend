import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Customer')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 32 })
  name: string; // Name of the customer

  @Column({ type: 'varchar', length: 255 })
  address: string; // Address of the customer

  @Column({ type: 'varchar', length: 64 })
  contact: string; // Contact information

  @Column({ type: 'varchar', length: 64, nullable: true })
  email: string; // Optional email address for communication

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
