import { Module } from '@nestjs/common';
import { ManualCultivoService } from './services/manual-cultivo.service';
import { CultiveService } from './services/cultive/cultive.service';
import { StationService } from './services/station/station.service';
import { FenologicService } from './services/fenologic/fenologic.service';
import { AnalyticService } from './services/analytic/analytic.service';
import { TemperatureDataService } from './services/temperature-data/temperature-data.service';
import { CultiveController } from './controllers/cultive.controller';
import { StationController } from './controllers/station.controller';
import { FenologicController } from './controllers/fenologic.controller';
import { AnalyticController } from './controllers/analytic.controller';
import { TemperatureDataController } from './controllers/temperature-data.controller';
import { StationCropService } from './services/station/station-crop.service';

@Module({
  controllers: [
    CultiveController,
    StationController,
    FenologicController,
    AnalyticController,
    TemperatureDataController,
  ],
  providers: [
    ManualCultivoService,
    StationCropService,
    CultiveService,
    StationService,
    FenologicService,
    AnalyticService,
    TemperatureDataService,
  ],
})
export class ManualCultivoModule { }
