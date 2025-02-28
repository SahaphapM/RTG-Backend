import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 32 })
  name: string; // Name of the user

  @Column({ type: 'varchar', length: 16, nullable: true })
  position: string; // Position of the user

  @Column({ type: 'varchar', length: 64, nullable: true })
  contact: string | null; // Contact information

  @Column({ type: 'varchar', length: 64, nullable: true })
  email: string; // Email address

  @Column({ type: 'varchar', length: 16, nullable: true })
  role: string; // Role in the system (e.g., Admin, Manager)

  @Column({ type: 'varchar', length: 255, nullable: true }) // Length for hashed password
  password: string; // Store hashed password here

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated

  // Hash password before saving
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Hash password before updating
  @BeforeUpdate()
  async hashPasswordUpdate() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
