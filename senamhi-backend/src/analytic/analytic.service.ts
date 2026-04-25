import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/services/base.service';
import { Analytic } from './interfaces/analytic.interface';
import { AnalyticDto } from './dto/create-analytic.dto';
import { UpdateAnalyticDto } from './dto/update-analytic.dto';
import { v4 as uuid } from 'uuid';
import { FenologicService } from '../fenologic/fenologic.service';
import { StationService } from '../station/station.service';
import { CultiveService } from '../cultive/cultive.service';

@Injectable()
export class AnalyticService extends BaseService<Analytic> {
    constructor(
        private readonly fenologicService: FenologicService,
        private readonly stationService: StationService,
        private readonly cultiveService: CultiveService,
    ) {
        super();
    }

    createAnalytic(dto: AnalyticDto): Analytic {
        const fenologicFound = this.fenologicService.findOne(dto.fenologicId);
        const stationFound = this.stationService.findOne(dto.stationId);
        const cultiveFound = this.cultiveService.findOne(dto.cultiveId);

        const newAnalytic: Analytic = {
            id: uuid(),
            dateAnalytic: dto.dateAnalytic,
            tempOptMin: dto.tempOptMin,
            tempOptMax: dto.tempOptMax,
            dates: dto.dates,
            fenologicValues: dto.fenologicValues,
            fenologicId: dto.fenologicId,
            fenologic: fenologicFound,
            cultiveId: dto.cultiveId,
            cultive: cultiveFound,
            stationId: dto.stationId,
            station: stationFound,
        };

        this.items.push(newAnalytic);

        return newAnalytic;
    }

    findByStation(stationId: string): Analytic[] {
        return this.items.filter(item => item.stationId === stationId);
    }

    updateAnalytic(id: string, dto: UpdateAnalyticDto): Analytic {
        const analytic = this.findOne(id);

        if (dto.dateAnalytic !== undefined) {
            analytic.dateAnalytic = dto.dateAnalytic;
        }
        if (dto.tempOptMin !== undefined) {
            analytic.tempOptMin = dto.tempOptMin;
        }
        if (dto.tempOptMax !== undefined) {
            analytic.tempOptMax = dto.tempOptMax;
        }
        if (dto.dates !== undefined) {
            analytic.dates = dto.dates;
        }
        if (dto.fenologicValues !== undefined) {
            analytic.fenologicValues = dto.fenologicValues;
        }

        if (dto.fenologicId) {
            const newFenologic = this.fenologicService.findOne(dto.fenologicId);
            analytic.fenologicId = dto.fenologicId;
            analytic.fenologic = newFenologic;
        }

        if (dto.stationId) {
            const newStation = this.stationService.findOne(dto.stationId);
            analytic.stationId = dto.stationId;
            analytic.station = newStation;
        }

        return analytic;
    }
}
