import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import { Cultive as CultiveEntity } from './entities/cultive.entity';
import { CreateCultiveDto } from './dto/create-cultive.dto';
import { UpdateCultiveDto } from './dto/update-cultive.dto';
import { StationService } from '../station/station.service';

@Injectable()
export class CultiveService extends BaseService<CultiveEntity> {
  constructor(
    @InjectRepository(CultiveEntity)
    private readonly cultiveRepository: Repository<CultiveEntity>,
    private readonly stationService: StationService,
  ) {
    super(cultiveRepository);
  }

  async createCultive(dto: CreateCultiveDto): Promise<CultiveEntity> {
    const foundStation = await this.stationService.findOne(dto.stationId);

    // Validación: no puede existir el mismo cultivo en la misma estación
    const exists = await this.cultiveRepository.findOne({
      where: {
        stationId: dto.stationId,
        nameCultive: dto.nameCultive
      }
    });

    if (exists) {
      throw new ConflictException(
        `El cultivo "${dto.nameCultive}" ya existe en la estación "${foundStation.nameStation}".`
      );
    }

    const newCultive = this.cultiveRepository.create({
      nameCultive: dto.nameCultive,
      stationId: dto.stationId,
      dayInterval: dto.dayInterval ?? 7,
    });

    return await this.cultiveRepository.save(newCultive);
  }

  async updateCultive(id: number, dto: UpdateCultiveDto): Promise<CultiveEntity> {
    const cultive = await this.findOne(id);
    if (dto.nameCultive !== undefined) {
      cultive.nameCultive = dto.nameCultive;
    }

    return await this.cultiveRepository.save(cultive);
  }
}
