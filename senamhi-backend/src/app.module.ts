import { Module } from '@nestjs/common';
import { CultiveModule } from './cultive/cultive.module';
import { StationModule } from './station/station.module';
import { FenologicModule } from './fenologic/fenologic.module';
import { AnalyticModule } from './analytic/analytic.module';
import { TemperatureDataModule } from './temperature-data/temperature-data.module';

@Module({
  imports: [
    CultiveModule,
    StationModule,
    FenologicModule,
    AnalyticModule,
    TemperatureDataModule,
  ],
  providers: [],
})
export class AppModule {}
