import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Station } from '../../station/entities/station.entity';
import { Cultive } from '../../cultive/entities/cultive.entity';
import { Fenologic } from '../../fenologic/entities/fenologic.entity';

@Entity('analytics')
export class Analytic {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'timestamp' })
  dateAnalytic: Date;

  @Column({ type: 'float' })
  tempOptMin: number;

  @Column({ type: 'float' })
  tempOptMax: number;

  @Column({ type: 'date', array: true })
  dates: Date[];

  @Column({ type: 'float', array: true })
  fenologicValues: number[][];

  @Column()
  stationId: number;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'stationId' })
  station: Station;

  @Column()
  cultiveId: number;

  @ManyToOne(() => Cultive)
  @JoinColumn({ name: 'cultiveId' })
  cultive: Cultive;

  @Column()
  fenologicId: number;

  @ManyToOne(() => Fenologic)
  @JoinColumn({ name: 'fenologicId' })
  fenologic: Fenologic;
}
