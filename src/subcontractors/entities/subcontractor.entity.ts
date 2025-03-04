import { Certificate } from 'src/certificates/entities/certificate.entity';
import { PurchaseOrder } from 'src/purchase-orders/entities/purchase-order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('Subcontractor')
export class Subcontractor {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column({ type: 'varchar', length: 64 })
  name: string; // Name of the subcontractor

  @Column({ type: 'varchar', length: 24, nullable: true })
  type: string | null; // Type of subcontractor (e.g., supplier, contractor), can be null

  @Column({ type: 'text', nullable: true })
  address: string | null; // Address of the subcontractor, can be null

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact: string | null; // Contact information, can be null

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string | null; // Optional email for communication, can be null

  @Column({ type: 'varchar', length: 64, nullable: true })
  taxId: string | null; // Tax ID, can be null

  @OneToMany(
    () => PurchaseOrder,
    (purchaseOrder) => purchaseOrder.subcontractor,
  )
  purchaseOrders: PurchaseOrder[];

  @OneToMany(() => Certificate, (certificate) => certificate.subcontractor)
  certificates: Certificate[];

  @CreateDateColumn()
  createdAt: Date; // Timestamp for when the record is created

  @UpdateDateColumn()
  updatedAt: Date; // Timestamp for when the record is last updated
}
