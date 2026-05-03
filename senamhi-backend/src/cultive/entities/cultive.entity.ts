import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Station } from '../../station/entities/station.entity';
import { Fenologic } from '../../fenologic/entities/fenologic.entity';

@Entity('cultives')
export class Cultive {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nameCultive: string;

  @Column({ default: 7 })
  dayInterval: number;

  @Column()
  stationId: number;

  @ManyToOne(() => Station, (station) => station.cultives, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stationId' })
  station: Station;

  @OneToMany(() => Fenologic, (fenologic) => fenologic.cultive)
  fenologics: Fenologic[];
}
