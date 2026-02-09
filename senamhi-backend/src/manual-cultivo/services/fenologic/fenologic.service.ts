import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Fenologic } from '../../interfaces/fenologic.interface';
import { CreateFenologicDto } from '../../dto/fenologic/create-fenologic.dto';
import { UpdateFenologicDto } from '../../dto/fenologic/update-fenologic.dto';
import { v4 as uuid } from 'uuid';
import { CultiveService } from '../cultive/cultive.service';

@Injectable()
export class FenologicService extends BaseService<Fenologic> {
  constructor(private readonly cultiveService: CultiveService) {
    super();
  }
  createFenologic(dto: CreateFenologicDto): Fenologic {
    const cultiveFound = this.cultiveService.findOne(dto.cultiveId);

    const newFenologic: Fenologic = {
      id: uuid(),
      nameFenologic: dto.nameFenologic,
      abbreviation: dto.abbreviation,
      cultiveId: dto.cultiveId,
      cultive: cultiveFound,
    };

    this.items.push(newFenologic);

    return newFenologic;
  }

  updateFenologic(id: string, dto: UpdateFenologicDto): Fenologic {
    const fenologic = this.findOne(id);
    if (dto.nameFenologic !== undefined) {
      fenologic.nameFenologic = dto.nameFenologic;
    }
    if (dto.abbreviation !== undefined) {
      fenologic.abbreviation = dto.abbreviation;
    }

    if (dto.cultiveId) {
      const newCultive = this.cultiveService.findOne(dto.cultiveId);
      fenologic.cultiveId = dto.cultiveId;
      fenologic.cultive = newCultive;
    }

    return fenologic;
  }
}
