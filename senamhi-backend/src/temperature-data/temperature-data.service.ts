import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { TemperatureData } from './interfaces/temperature-data.interface';
import { CreateTemperatureDataDto } from './dto/create-temperature-data.dto';
import { UpdateTemperatureDataDto } from './dto/update-temperature-data.dto';
import { StationService } from '../station/station.service';

@Injectable()
export class TemperatureDataService {
    private temperatureData: TemperatureData[] = [];

    constructor(private readonly stationService: StationService) { }

    async createTemperatureData(dto: CreateTemperatureDataDto): Promise<TemperatureData> {
        const stationFound = await this.stationService.findOne(dto.stationId);
        if (!stationFound) {
            throw new Error('Station not found');
        }

        const newTempData: TemperatureData = {
            id: uuid(),
            stationId: dto.stationId,
            station: stationFound,
            month: dto.month,
            year: dto.year,
            tempMaxValues: dto.tempMaxValues,
            tempMinValues: dto.tempMinValues,
            precipValues: dto.precipValues,
        };

        this.temperatureData.push(newTempData);
        return newTempData;
    }

    async findAll(): Promise<TemperatureData[]> {
        return this.temperatureData;
    }

    async findByStation(stationId: string): Promise<TemperatureData[]> {
        return this.temperatureData.filter(td => td.stationId === stationId);
    }

    async findByStationAndMonth(stationId: string, month: number, year: number): Promise<TemperatureData | undefined> {
        return this.temperatureData.find(
            td => td.stationId === stationId && td.month === month && td.year === year
        );
    }

    async findOne(id: string): Promise<TemperatureData | undefined> {
        return this.temperatureData.find(td => td.id === id);
    }

    async getUploadedMonths(stationId: string, year: number): Promise<{ uploadedMonths: number[], files: Record<number, string> }> {
        const data = this.temperatureData.filter(
            td => td.stationId === stationId && td.year === year
        );

        const uploadedMonths = data.map(td => td.month);
        const files: Record<number, string> = {};

        data.forEach(td => {
            const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
            files[td.month] = `${monthNames[td.month - 1]}_${year}.xlsx`;
        });

        return { uploadedMonths, files };
    }

    async updateTemperatureData(id: string, dto: UpdateTemperatureDataDto): Promise<TemperatureData> {
        const tempData = await this.findOne(id);
        if (!tempData) {
            throw new Error('Temperature data not found');
        }

        if (dto.tempMaxValues !== undefined) {
            tempData.tempMaxValues = dto.tempMaxValues;
        }
        if (dto.tempMinValues !== undefined) {
            tempData.tempMinValues = dto.tempMinValues;
        }
        if (dto.precipValues !== undefined) {
            tempData.precipValues = dto.precipValues;
        }

        return tempData;
    }

    async deleteTemperatureData(id: string): Promise<void> {
        const index = this.temperatureData.findIndex(td => td.id === id);
        if (index !== -1) {
            this.temperatureData.splice(index, 1);
        }
    }
}

