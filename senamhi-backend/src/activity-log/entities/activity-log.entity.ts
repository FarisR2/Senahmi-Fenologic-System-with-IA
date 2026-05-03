import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  entityType: string;

  @Column({ type: 'int', nullable: true })
  entityId: number | null;

  @Column({ type: 'varchar', length: 50 })
  actionType: string;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', nullable: true })
  progress: number | null;

  @CreateDateColumn()
  createdAt: Date;
}