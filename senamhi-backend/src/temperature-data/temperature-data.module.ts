import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemperatureDataController } from './temperature-data.controller';
import { TemperatureDataService } from './temperature-data.service';
import { StationModule } from '../station/station.module';
import { TemperatureData } from './entities/temperature-data.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemperatureData]),
    StationModule
  ],
  controllers: [TemperatureDataController],
  providers: [TemperatureDataService]
})
export class TemperatureDataModule { }

