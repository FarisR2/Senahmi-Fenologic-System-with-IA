import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cultive } from '../../cultive/entities/cultive.entity';

@Entity('stations')
export class Station {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  nameStation: string;

  @Column({ nullable: true })
  location?: string;

  @OneToMany(() => Cultive, (cultive) => cultive.station)
  cultives: Cultive[];
}
