import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cultive } from '../../cultive/entities/cultive.entity';

@Entity('fenologics')
export class Fenologic {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nameFenologic: string;

  @Column()
  abbreviation: string;

  @Column()
  cultiveId: number;

  @ManyToOne(() => Cultive, (cultive) => cultive.fenologics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cultiveId' })
  cultive: Cultive;
}
