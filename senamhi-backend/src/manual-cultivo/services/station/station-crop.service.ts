import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { StationCrop } from 'src/manual-cultivo/interfaces/station-crop.interface';
import { StationCropDto } from 'src/manual-cultivo/dto/station/stationCrop/create-station-crop.dto';
import { CultiveService } from '../cultive/cultive.service';
import { v4 as uuid } from 'uuid';
import { StationService } from './station.service';

@Injectable()
export class StationCropService extends BaseService<StationCrop> {
  constructor(
    private readonly cultiveService: CultiveService,
    private readonly stationService: StationService,
  ) {
    super();
  }
  createStationCrop(dto: StationCropDto): StationCrop {
    const foundCultive = this.cultiveService.findOne(dto.cultiveId);
    const foundStation = this.stationService.findOne(dto.stationId);

    const newStationCrop: StationCrop = {
      id: uuid(),
      cultiveId: dto.cultiveId,
      cultive: foundCultive,
      stationId: dto.stationId,
      station: foundStation,
    };

    this.items.push(newStationCrop);

    return newStationCrop;
  }
}
