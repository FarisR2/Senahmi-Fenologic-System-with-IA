import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Cultive } from '../../interfaces/cultive.interface';
import { CreateCultiveDto } from '../../dto/cultive/create-cultive.dto';
import { UpdateCultiveDto } from '../../dto/cultive/update-cultive.dto';
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
