import { Project } from 'src/projects/entities/project.entity';
import { PurchaseOrder } from 'src/purchase-orders/entities/purchase-order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('Customer')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 64 })
  name: string; // Name of the customer

  @Column({ type: 'varchar', length: 255 })
  address: string; // Address of the customer

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact: string | null; // Allow contact to be null

  @Column({ type: 'varchar', length: 64, nullable: true })
  email: string | null; // Optional email address for communication

  @Column({ type: 'varchar', length: 13, nullable: true })
  taxId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  agentName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  agentEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  agentContact: string;

  @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.customer)
  purchaseOrders: PurchaseOrder[];

  @OneToMany(() => Project, (project) => project.customer)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
