import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { TemperatureDataService } from './temperature-data.service';
import { CreateTemperatureDataDto } from './dto/create-temperature-data.dto';
import { UpdateTemperatureDataDto } from './dto/update-temperature-data.dto';

@Controller('temperature-data')
export class TemperatureDataController {
    constructor(private readonly temperatureDataService: TemperatureDataService) { }

    @Get()
    async findAll() {
        return await this.temperatureDataService.findAll();
    }

    @Get('by-station/:stationId')
    async findByStation(@Param('stationId', ParseIntPipe) stationId: number) {
        return await this.temperatureDataService.findByStation(stationId);
    }

    @Get('uploaded/:stationId/:year')
    async getUploadedMonths(
        @Param('stationId', ParseIntPipe) stationId: number,
        @Param('year', ParseIntPipe) year: number
    ) {
        return await this.temperatureDataService.getUploadedMonths(stationId, year);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.temperatureDataService.findOne(id);
    }

    @Post('create-temperature-data')
    async create(@Body() dto: CreateTemperatureDataDto) {
        return await this.temperatureDataService.createTemperatureData(dto);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTemperatureDataDto) {
        return await this.temperatureDataService.updateTemperatureData(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.temperatureDataService.deleteTemperatureData(id);
    }
}
