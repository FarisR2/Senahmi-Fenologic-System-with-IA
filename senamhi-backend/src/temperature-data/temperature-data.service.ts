import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemperatureData as TemperatureDataEntity } from './entities/temperature-data.entity';
import { CreateTemperatureDataDto } from './dto/create-temperature-data.dto';
import { UpdateTemperatureDataDto } from './dto/update-temperature-data.dto';
import { StationService } from '../station/station.service';

@Injectable()
export class TemperatureDataService {
    constructor(
        @InjectRepository(TemperatureDataEntity)
        private readonly temperatureDataRepository: Repository<TemperatureDataEntity>,
        private readonly stationService: StationService
    ) { }

    async createTemperatureData(dto: CreateTemperatureDataDto): Promise<TemperatureDataEntity> {
        await this.stationService.findOne(dto.stationId);

        const newTempData = this.temperatureDataRepository.create({
            stationId: dto.stationId,
            month: dto.month,
            year: dto.year,
            tempMaxValues: dto.tempMaxValues,
            tempMinValues: dto.tempMinValues,
            precipValues: dto.precipValues,
        });

        return await this.temperatureDataRepository.save(newTempData);
    }

    async findAll(): Promise<TemperatureDataEntity[]> {
        return await this.temperatureDataRepository.find({ relations: ['station'] });
    }

    async findByStation(stationId: number): Promise<TemperatureDataEntity[]> {
        return await this.temperatureDataRepository.find({
            where: { stationId },
            relations: ['station']
        });
    }

    async findByStationAndMonth(stationId: number, month: number, year: number): Promise<TemperatureDataEntity | null> {
        return await this.temperatureDataRepository.findOne({
            where: { stationId, month, year },
            relations: ['station']
        });
    }

    async findOne(id: number): Promise<TemperatureDataEntity> {
        const item = await this.temperatureDataRepository.findOne({
            where: { id },
            relations: ['station']
        });
        if (!item) throw new NotFoundException(`Temperature data with ID ${id} not found`);
        return item;
    }

    async getUploadedMonths(stationId: number, year: number): Promise<{ uploadedMonths: number[], files: Record<number, string> }> {
        const data = await this.temperatureDataRepository.find({
            where: { stationId, year }
        });

        const uploadedMonths = data.map(td => td.month);
        const files: Record<number, string> = {};

        data.forEach(td => {
            const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
            files[td.month] = `${monthNames[td.month - 1]}_${year}.xlsx`;
        });

        return { uploadedMonths, files };
    }

    async updateTemperatureData(id: number, dto: UpdateTemperatureDataDto): Promise<TemperatureDataEntity> {
        const tempData = await this.findOne(id);

        if (dto.tempMaxValues !== undefined) {
            tempData.tempMaxValues = dto.tempMaxValues;
        }
        if (dto.tempMinValues !== undefined) {
            tempData.tempMinValues = dto.tempMinValues;
        }
        if (dto.precipValues !== undefined) {
            tempData.precipValues = dto.precipValues;
        }

        return await this.temperatureDataRepository.save(tempData);
    }

    async deleteTemperatureData(id: number): Promise<void> {
        const item = await this.findOne(id);
        await this.temperatureDataRepository.remove(item);
    }
}

