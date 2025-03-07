import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { Item } from '../../items/entities/item.entity';
import { Exclude } from 'class-transformer';
import { JobQuotation } from 'src/job-quotations/entities/job-quotation.entity';

@Entity('ProjectItem')
export class ProjectItem {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'int', default: 1 })
  quantity: number; // Quantity of the item in the project

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value, // แปลงเป็นค่าเดิมก่อนบันทึกลง DB
      from: (value: string) => parseFloat(value), // แปลงกลับเป็น number เมื่อดึงจาก DB
    },
  })
  price: number | null; // Price at the time

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value, // แปลงเป็นค่าเดิมก่อนบันทึกลง DB
      from: (value: string) => parseFloat(value), // แปลงกลับเป็น number เมื่อดึงจาก DB
    },
  })
  totalPrice: number | null; // Total price of items

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated

  @ManyToOne(() => Project, (project) => project.projectItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  project: Project; // Foreign Key: Project associated with the item

  @ManyToOne(() => Item, (item) => item.projectItems, {
    cascade: true,
  })
  item: Item; // Foreign Key: Item associated with the project
}
