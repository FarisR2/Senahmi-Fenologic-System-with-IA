import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Station } from '../../interfaces/station.interface';
import { CreateStationDto } from '../../dto/station/create-station.dto';
import { UpdateStationDto } from '../../dto/station/update-station.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StationService extends BaseService<Station> {
  createStation(dto: CreateStationDto): Station {
    const newStation: Station = {
      id: uuid(),
      nameStation: dto.nameStation,
    };

    this.items.push(newStation);

    return newStation;
  }

  updateStation(id: string, dto: UpdateStationDto): Station {
    const station = this.findOne(id);
    if (dto.nameStation !== undefined) {
      station.nameStation = dto.nameStation;
    }

    return station;
  }
}
