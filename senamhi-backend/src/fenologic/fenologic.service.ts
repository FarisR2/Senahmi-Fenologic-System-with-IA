import { ConflictException, Injectable } from '@nestjs/common';
import { BaseService } from '../common/services/base.service';
import { Fenologic } from './interfaces/fenologic.interface';
import { CreateFenologicDto } from './dto/create-fenologic.dto';
import { UpdateFenologicDto } from './dto/update-fenologic.dto';
import { v4 as uuid } from 'uuid';
import { CultiveService } from '../cultive/cultive.service';

@Injectable()
export class FenologicService extends BaseService<Fenologic> {
  constructor(private readonly cultiveService: CultiveService) {
    super();
  }
  createFenologic(dto: CreateFenologicDto): Fenologic {
    const cultiveFound = this.cultiveService.findOne(dto.cultiveId);

    // Validación: no puede existir la misma fenología (por nombre o abreviatura) en el mismo cultivo
    const duplicateName = this.items.some(
      (f) =>
        f.cultiveId === dto.cultiveId &&
        f.nameFenologic.trim().toLowerCase() === dto.nameFenologic.trim().toLowerCase()
    );
    if (duplicateName) {
      throw new ConflictException(
        `La fenología "${dto.nameFenologic}" ya existe para el cultivo "${cultiveFound.nameCultive}".`
      );
    }

    const duplicateAbbr = this.items.some(
      (f) =>
        f.cultiveId === dto.cultiveId &&
        f.abbreviation.trim().toLowerCase() === dto.abbreviation.trim().toLowerCase()
    );
    if (duplicateAbbr) {
      throw new ConflictException(
        `La abreviatura "${dto.abbreviation}" ya existe para el cultivo "${cultiveFound.nameCultive}".`
      );
    }

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
