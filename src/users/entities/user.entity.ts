import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 32 })
  name: string; // Name of the user

  @Column({ type: 'varchar', length: 16 })
  position: string; // Position of the user

  @Column({ type: 'varchar', length: 64 })
  contact: string; // Contact information

  @Column({ type: 'varchar', length: 64, unique: true, nullable: true })
  email: string; // Email address

  @Column({ type: 'varchar', length: 16, nullable: true })
  role: string; // Role in the system (e.g., Admin, Manager)

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}

export enum UserRoles {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
}
