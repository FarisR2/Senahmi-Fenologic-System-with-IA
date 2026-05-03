import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import { Fenologic as FenologicEntity } from './entities/fenologic.entity';
import { CreateFenologicDto } from './dto/create-fenologic.dto';
import { UpdateFenologicDto } from './dto/update-fenologic.dto';
import { CultiveService } from '../cultive/cultive.service';

@Injectable()
export class FenologicService extends BaseService<FenologicEntity> {
  constructor(
    @InjectRepository(FenologicEntity)
    private readonly fenologicRepository: Repository<FenologicEntity>,
    private readonly cultiveService: CultiveService,
  ) {
    super(fenologicRepository);
  }

  async createFenologic(dto: CreateFenologicDto): Promise<FenologicEntity> {
    const cultiveFound = await this.cultiveService.findOne(dto.cultiveId);

    // Validación: no puede existir la misma fenología (por nombre o abreviatura) en el mismo cultivo
    const duplicateName = await this.fenologicRepository.findOne({
      where: {
        cultiveId: dto.cultiveId,
        nameFenologic: dto.nameFenologic
      }
    });

    if (duplicateName) {
      throw new ConflictException(
        `La fenología "${dto.nameFenologic}" ya existe para el cultivo "${cultiveFound.nameCultive}".`
      );
    }

    const duplicateAbbr = await this.fenologicRepository.findOne({
      where: {
        cultiveId: dto.cultiveId,
        abbreviation: dto.abbreviation
      }
    });

    if (duplicateAbbr) {
      throw new ConflictException(
        `La abreviatura "${dto.abbreviation}" ya existe para el cultivo "${cultiveFound.nameCultive}".`
      );
    }

    const newFenologic = this.fenologicRepository.create({
      nameFenologic: dto.nameFenologic,
      abbreviation: dto.abbreviation,
      cultiveId: dto.cultiveId,
    });

    return await this.fenologicRepository.save(newFenologic);
  }

  async updateFenologic(id: number, dto: UpdateFenologicDto): Promise<FenologicEntity> {
    const fenologic = await this.findOne(id);
    if (dto.nameFenologic !== undefined) {
      fenologic.nameFenologic = dto.nameFenologic;
    }
    if (dto.abbreviation !== undefined) {
      fenologic.abbreviation = dto.abbreviation;
    }

    if (dto.cultiveId) {
      await this.cultiveService.findOne(dto.cultiveId);
      fenologic.cultiveId = dto.cultiveId;
    }

    return await this.fenologicRepository.save(fenologic);
  }
}
