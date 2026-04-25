import { Module } from '@nestjs/common';
import { TemperatureDataController } from './temperature-data.controller';
import { TemperatureDataService } from './temperature-data.service';
import { StationModule } from '../station/station.module';

@Module({
  imports: [StationModule],
  controllers: [TemperatureDataController],
  providers: [TemperatureDataService],
})
export class TemperatureDataModule {}
