import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common';
import { AnalyticService } from './analytic.service';
import { AnalyticDto } from './dto/create-analytic.dto';
import { UpdateAnalyticDto } from './dto/update-analytic.dto';

@Controller('analytic')
export class AnalyticController {
    constructor(private readonly analyticService: AnalyticService) { }

    @Get()
    async findAll() {
        return await this.analyticService.findAll();
    }

    @Get('by-station/:stationId')
    async findByStation(@Param('stationId', ParseIntPipe) stationId: number) {
        return await this.analyticService.findByStation(stationId);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.analyticService.findOne(id);
    }

    @Post('/create-analytic')
    async createAnalytic(@Body() dto: AnalyticDto) {
        return await this.analyticService.createAnalytic(dto);
    }

    @Put(':id')
    async updateAnalytic(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAnalyticDto,
    ) {
        return await this.analyticService.updateAnalytic(id, dto);
    }

    @Delete(':id')
    async deleteAnalytic(@Param('id', ParseIntPipe) id: number) {
        return await this.analyticService.remove(id);
    }
}
