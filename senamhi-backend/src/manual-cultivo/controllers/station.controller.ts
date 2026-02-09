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
import { StationService } from '../services/station/station.service';
import { CreateStationDto } from '../dto/station/create-station.dto';
import { UpdateStationDto } from '../dto/station/update-station.dto';
import { StationCropDto } from '../dto/station/stationCrop/create-station-crop.dto';
import { StationCropService } from '../services/station/station-crop.service';

@Controller('station')
export class StationController {
  constructor(
    private readonly stationService: StationService,
    private readonly stationCropService: StationCropService,
  ) { }

  @Get()
  findAll() {
    return this.stationService.findAll();
  }

  @Get('/stationCrop')
  findAllCrop() {
    return this.stationCropService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.stationService.findOne(id);
  }

  @Post('/create-station')
  createStation(@Body() dto: CreateStationDto) {
    return this.stationService.createStation(dto);
  }

  @Post('/create-station-cultive')
  createStationCrop(@Body() dto: StationCropDto) {
    return this.stationCropService.createStationCrop(dto);
  }

  @Put(':id')
  updateStation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStationDto,
  ) {
    return this.stationService.updateStation(id, dto);
  }

  @Delete(':id')
  deleteStation(@Param('id', ParseUUIDPipe) id: string) {
    return this.stationService.remove(id);
  }
}
