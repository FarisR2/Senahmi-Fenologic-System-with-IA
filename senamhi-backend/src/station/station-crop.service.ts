import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import { StationCrop as StationCropEntity } from './entities/station-crop.entity';
import { StationCropDto } from './dto/create-station-crop.dto';
import { CultiveService } from '../cultive/cultive.service';
import { StationService } from './station.service';

@Injectable()
export class StationCropService extends BaseService<StationCropEntity> {
  constructor(
    @InjectRepository(StationCropEntity)
    private readonly stationCropRepository: Repository<StationCropEntity>,
    private readonly cultiveService: CultiveService,
    private readonly stationService: StationService,
  ) {
    super(stationCropRepository);
  }

  async createStationCrop(dto: StationCropDto): Promise<StationCropEntity> {
    await this.cultiveService.findOne(dto.cultiveId);
    await this.stationService.findOne(dto.stationId);

    const newStationCrop = this.stationCropRepository.create({
      cultiveId: dto.cultiveId,
      stationId: dto.stationId,
    });

    return await this.stationCropRepository.save(newStationCrop);
  }
}
