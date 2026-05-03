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
import { StationService } from './station.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { StationCropDto } from './dto/create-station-crop.dto';
import { StationCropService } from './station-crop.service';

@Controller('station')
export class StationController {
  constructor(
    private readonly stationService: StationService,
    private readonly stationCropService: StationCropService,
  ) { }

  @Get()
  async findAll() {
    return await this.stationService.findAll();
  }

  @Get('/stationCrop')
  async findAllCrop() {
    return await this.stationCropService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.stationService.findOne(id);
  }

  @Post('/create-station')
  async createStation(@Body() dto: CreateStationDto) {
    return await this.stationService.createStation(dto);
  }

  @Post('/create-station-cultive')
  async createStationCrop(@Body() dto: StationCropDto) {
    return await this.stationCropService.createStationCrop(dto);
  }

  @Put(':id')
  async updateStation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStationDto,
  ) {
    return await this.stationService.updateStation(id, dto);
  }

  @Delete(':id')
  async deleteStation(@Param('id', ParseIntPipe) id: number) {
    return await this.stationService.remove(id);
  }
}
