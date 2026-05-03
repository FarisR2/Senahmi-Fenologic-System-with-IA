import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../station/entities/station.entity';
import { Cultive } from '../cultive/entities/cultive.entity';
import { Fenologic } from '../fenologic/entities/fenologic.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    @InjectRepository(Cultive)
    private readonly cultiveRepository: Repository<Cultive>,
    @InjectRepository(Fenologic)
    private readonly fenologicRepository: Repository<Fenologic>,
  ) {}

  async getStats() {
    const [stationsCount, cultivesCount, fenologicsCount] = await Promise.all([
      this.stationRepository.count(),
      this.cultiveRepository.count(),
      this.fenologicRepository.count(),
    ]);

    return {
      stations: {
        count: stationsCount,
        label: 'ESTACIONES CREADAS',
        trend: '+2.4%', // Mock trend as we don't have historical data to calculate this yet
        statusText: '99.2% Tiempo de actividad operativo' // Mock status
      },
      cultives: {
        count: cultivesCount,
        label: 'CULTIVOS MONITOREADOS',
        tag: 'Estable', // Mock tag
        statusText: 'Enfoque en productos clave'
      },
      fenologics: {
        count: fenologicsCount,
        label: 'FENOLOGÍAS CREADAS',
        tag: '8 Urgentes', // Mock tag
        statusText: 'Validación de datos requerida'
      }
    };
  }
}
