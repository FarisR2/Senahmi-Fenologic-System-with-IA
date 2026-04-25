import { ConflictException, Injectable } from '@nestjs/common';
import { BaseService } from '../common/services/base.service';
import { Station } from './interfaces/station.interface';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StationService extends BaseService<Station> {
  createStation(dto: CreateStationDto): Station {
    // Validación de unicidad: no puede existir otra estación con el mismo nombre
    const exists = this.items.some(
      (s) => s.nameStation.trim().toLowerCase() === dto.nameStation.trim().toLowerCase()
    );
    if (exists) {
      throw new ConflictException(`La estación "${dto.nameStation}" ya existe.`);
    }

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
