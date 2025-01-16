import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectItem } from '../../projects/entities/project-item.entity';

@Entity('Item')
export class Item {
  @PrimaryGeneratedColumn()
  id: number; // Primary Key: Auto-incremented ID

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => ProjectItem, (projectItem) => projectItem.item)
  projectItems: ProjectItem[];
}
