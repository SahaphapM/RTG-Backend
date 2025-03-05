import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectItem } from '../../projects/entities/project-item.entity';

@Entity('Item')
export class Item {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column()
  name: string;

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
  price: number;

  @OneToMany(() => ProjectItem, (projectItem) => projectItem.item, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  projectItems: ProjectItem[];
}
