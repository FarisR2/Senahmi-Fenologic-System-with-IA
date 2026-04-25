import { ConflictException, Injectable } from '@nestjs/common';
import { BaseService } from '../common/services/base.service';
import { Cultive } from './interfaces/cultive.interface';
import { CreateCultiveDto } from './dto/create-cultive.dto';
import { UpdateCultiveDto } from './dto/update-cultive.dto';
import { v4 as uuid } from 'uuid';
import { StationService } from '../station/station.service';

@Injectable()
export class CultiveService extends BaseService<Cultive> {
  constructor(
    private readonly stationService: StationService,
  ) {
    super();
  }

  createCultive(dto: CreateCultiveDto): Cultive {
    const foundStation = this.stationService.findOne(dto.stationId);

    // Validación: no puede existir el mismo cultivo en la misma estación
    const exists = this.items.some(
      (c) =>
        c.stationId === dto.stationId &&
        c.nameCultive.trim().toLowerCase() === dto.nameCultive.trim().toLowerCase()
    );
    if (exists) {
      throw new ConflictException(
        `El cultivo "${dto.nameCultive}" ya existe en la estación "${foundStation.nameStation}".`
      );
    }

    const newCultive: Cultive = {
      id: uuid(),
      nameCultive: dto.nameCultive,
      stationId: dto.stationId,
      station: foundStation,
      dayInterval: dto.dayInterval ?? 7,
    };

    this.items.push(newCultive);
    return newCultive;
  }

  updateCultive(id: string, dto: UpdateCultiveDto): Cultive {
    const cultive = this.findOne(id);
    if (dto.nameCultive !== undefined) {
      cultive.nameCultive = dto.nameCultive;
    }

    return cultive;
  }
}
