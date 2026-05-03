import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import { Station as StationEntity } from './entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationService extends BaseService<StationEntity> {
  constructor(
    @InjectRepository(StationEntity)
    private readonly stationRepository: Repository<StationEntity>,
  ) {
    super(stationRepository);
  }

  async createStation(dto: CreateStationDto): Promise<StationEntity> {
    const exists = await this.stationRepository.findOne({
      where: { nameStation: dto.nameStation }
    });

    if (exists) {
      throw new ConflictException(`La estación "${dto.nameStation}" ya existe.`);
    }

    const newStation = this.stationRepository.create({
      nameStation: dto.nameStation,
    });

    return await this.stationRepository.save(newStation);
  }

  async updateStation(id: number, dto: UpdateStationDto): Promise<StationEntity> {
    const station = await this.findOne(id);
    if (dto.nameStation !== undefined) {
      station.nameStation = dto.nameStation;
    }

    return await this.stationRepository.save(station);
  }
}
