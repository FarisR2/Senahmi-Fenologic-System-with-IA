import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
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
    findAll() {
        return this.analyticService.findAll();
    }

    @Get('by-station/:stationId')
    findByStation(@Param('stationId', ParseUUIDPipe) stationId: string) {
        return this.analyticService.findByStation(stationId);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.analyticService.findOne(id);
    }

    @Post('/create-analytic')
    createAnalytic(@Body() dto: AnalyticDto) {
        return this.analyticService.createAnalytic(dto);
    }

    @Put(':id')
    updateAnalytic(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAnalyticDto,
    ) {
        return this.analyticService.updateAnalytic(id, dto);
    }

    @Delete(':id')
    deleteAnalytic(@Param('id', ParseUUIDPipe) id: string) {
        return this.analyticService.remove(id);
    }
}
