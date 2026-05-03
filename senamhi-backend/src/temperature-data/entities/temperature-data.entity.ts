import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Station } from '../../station/entities/station.entity';

@Entity('temperature_data')
export class TemperatureData {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  stationId: number;

  @ManyToOne(() => Station, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stationId' })
  station: Station;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column('float', { array: true })
  tempMaxValues: number[];

  @Column('float', { array: true })
  tempMinValues: number[];

  @Column('float', { array: true })
  precipValues: number[];
}
