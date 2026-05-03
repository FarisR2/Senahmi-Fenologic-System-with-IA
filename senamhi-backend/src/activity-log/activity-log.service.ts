import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogService implements OnModuleInit {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async onModuleInit() {
    await this.seedInitialLogs();
  }

  async getRecentLogs(limit: number = 5): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // Provisional method to log new activities from other services
  async logActivity(data: Partial<ActivityLog>): Promise<ActivityLog> {
    const newLog = this.activityLogRepository.create(data);
    return this.activityLogRepository.save(newLog);
  }

  private async seedInitialLogs() {
    const count = await this.activityLogRepository.count();
    if (count === 0) {
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

      const oneHourAhead = new Date();
      oneHourAhead.setHours(oneHourAhead.getHours() + 1);

      const mockLogs = [
        {
          entityType: 'FENOLOGIC',
          entityId: 1,
          actionType: 'COMPLETED',
          status: 'COMPLETADO',
          title: 'Fenología: Floración de Cultivo: Papa',
          description: 'Se detectó el inicio masivo de floración en el clúster de Huancayo.',
          progress: null,
          createdAt: tenMinutesAgo,
        },
        {
          entityType: 'FENOLOGIC',
          entityId: 2,
          actionType: 'PROCESSING',
          status: 'PROCESAMIENTO ACTIVO',
          title: 'Fenología: Maduración de Cultivo: Maíz',
          description: 'Análisis de coloración de grano en el valle del Mantaro.',
          progress: 80,
          createdAt: new Date(),
        },
        {
          entityType: 'FENOLOGIC',
          entityId: 3,
          actionType: 'SCHEDULED',
          status: 'PROGRAMADO',
          title: 'Fenología: Siembra de Cultivo: Arroz',
          description: 'Preparación del ciclo de monitoreo para la campaña norte.',
          progress: null,
          createdAt: oneHourAhead, // Scheduled for future
        }
      ];

      for (const log of mockLogs) {
        await this.logActivity(log);
      }
      console.log('Seeded initial ActivityLogs');
    }
  }
}
