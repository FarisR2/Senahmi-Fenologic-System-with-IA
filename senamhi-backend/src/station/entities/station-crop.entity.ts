import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Station } from './station.entity';
import { Cultive } from '../../cultive/entities/cultive.entity';

@Entity('station_crops')
export class StationCrop {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  stationId: number;

  @ManyToOne(() => Station, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stationId' })
  station: Station;

  @Column()
  cultiveId: number;

  @ManyToOne(() => Cultive, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cultiveId' })
  cultive: Cultive;
}
