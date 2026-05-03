import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import { Analytic as AnalyticEntity } from './entities/analytic.entity';
import { AnalyticDto } from './dto/create-analytic.dto';
import { UpdateAnalyticDto } from './dto/update-analytic.dto';
import { FenologicService } from '../fenologic/fenologic.service';
import { StationService } from '../station/station.service';
import { CultiveService } from '../cultive/cultive.service';

@Injectable()
export class AnalyticService extends BaseService<AnalyticEntity> {
    constructor(
        @InjectRepository(AnalyticEntity)
        private readonly analyticRepository: Repository<AnalyticEntity>,
        private readonly fenologicService: FenologicService,
        private readonly stationService: StationService,
        private readonly cultiveService: CultiveService,
    ) {
        super(analyticRepository);
    }

    async createAnalytic(dto: AnalyticDto): Promise<AnalyticEntity> {
        await this.fenologicService.findOne(dto.fenologicId);
        await this.stationService.findOne(dto.stationId);
        await this.cultiveService.findOne(dto.cultiveId);

        const newAnalytic = this.analyticRepository.create({
            dateAnalytic: dto.dateAnalytic,
            tempOptMin: dto.tempOptMin,
            tempOptMax: dto.tempOptMax,
            dates: dto.dates,
            fenologicValues: dto.fenologicValues,
            fenologicId: dto.fenologicId,
            cultiveId: dto.cultiveId,
            stationId: dto.stationId,
        });

        return await this.analyticRepository.save(newAnalytic);
    }

    async findByStation(stationId: number): Promise<AnalyticEntity[]> {
        return await this.analyticRepository.find({
            where: { stationId },
            relations: ['fenologic', 'cultive', 'station']
        });
    }

    async updateAnalytic(id: number, dto: UpdateAnalyticDto): Promise<AnalyticEntity> {
        const analytic = await this.findOne(id);

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
            await this.fenologicService.findOne(dto.fenologicId);
            analytic.fenologicId = dto.fenologicId;
        }

        if (dto.stationId) {
            await this.stationService.findOne(dto.stationId);
            analytic.stationId = dto.stationId;
        }

        return await this.analyticRepository.save(analytic);
    }
}
