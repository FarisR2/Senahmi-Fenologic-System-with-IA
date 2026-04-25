import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TemperatureDataService } from './temperature-data.service';
import { CreateTemperatureDataDto } from './dto/create-temperature-data.dto';
import { UpdateTemperatureDataDto } from './dto/update-temperature-data.dto';

@Controller('temperature-data')
export class TemperatureDataController {
    constructor(private readonly temperatureDataService: TemperatureDataService) { }

    @Get()
    findAll() {
        return this.temperatureDataService.findAll();
    }

    @Get('by-station/:stationId')
    findByStation(@Param('stationId') stationId: string) {
        return this.temperatureDataService.findByStation(stationId);
    }

    @Get('uploaded/:stationId/:year')
    getUploadedMonths(
        @Param('stationId') stationId: string,
        @Param('year') year: string
    ) {
        return this.temperatureDataService.getUploadedMonths(stationId, parseInt(year));
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.temperatureDataService.findOne(id);
    }

    @Post('create-temperature-data')
    create(@Body() dto: CreateTemperatureDataDto) {
        return this.temperatureDataService.createTemperatureData(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTemperatureDataDto) {
        return this.temperatureDataService.updateTemperatureData(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.temperatureDataService.deleteTemperatureData(id);
    }
}
