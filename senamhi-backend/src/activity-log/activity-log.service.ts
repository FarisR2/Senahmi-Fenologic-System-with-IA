import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { ActivityLog } from './entities/activity-log.entity';
import { CultiveCreatedEvent } from '../common/events/cultive.events';
import { StationCreatedEvent } from '../common/events/station.events';

@Injectable()
export class ActivityLogService implements OnModuleInit {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async onModuleInit() {
    await this.seedInitialLogs();
  }

  @OnEvent('cultive.created')
  async handleCultiveCreated(payload: CultiveCreatedEvent) {
    console.log('Event received: cultive.created', payload);
    await this.logActivity({
      entityType: 'CULTIVE',
      entityId: payload.id,
      actionType: 'CREATED',
      status: 'EXITOSO',
      title: `Nuevo Cultivo: ${payload.nameCultive}`,
      description: `Se ha registrado el cultivo "${payload.nameCultive}" satisfactoriamente.`,
    });
  }

  @OnEvent('station.created')
  async handleStationCreated(payload: StationCreatedEvent) {
    await this.logActivity({
      entityType: 'STATION',
      entityId: payload.id,
      actionType: 'CREATED',
      status: 'EXITOSO',
      title: `Nueva Estación: ${payload.nameStation}`,
      description: `La estación "${payload.nameStation}" ha sido dada de alta en el sistema.`,
    });
  }

  @OnEvent('**')
  handleAllEvents(payload: any, event: string) {
    console.log(`[Event Debug] Event emitted: ${event}`, payload);
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
          description:
            'Se detectó el inicio masivo de floración en el clúster de Huancayo.',
          progress: null,
          createdAt: tenMinutesAgo,
        },
        {
          entityType: 'FENOLOGIC',
          entityId: 2,
          actionType: 'PROCESSING',
          status: 'PROCESAMIENTO ACTIVO',
          title: 'Fenología: Maduración de Cultivo: Maíz',
          description:
            'Análisis de coloración de grano en el valle del Mantaro.',
          progress: 80,
          createdAt: new Date(),
        },
        {
          entityType: 'FENOLOGIC',
          entityId: 3,
          actionType: 'SCHEDULED',
          status: 'PROGRAMADO',
          title: 'Fenología: Siembra de Cultivo: Arroz',
          description:
            'Preparación del ciclo de monitoreo para la campaña norte.',
          progress: null,
          createdAt: oneHourAhead, // Scheduled for future
        },
      ];

      for (const log of mockLogs) {
        await this.logActivity(log);
      }
      console.log('Seeded initial ActivityLogs');
    }
  }
}
