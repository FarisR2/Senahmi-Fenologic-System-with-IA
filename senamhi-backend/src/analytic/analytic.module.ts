import { Module } from '@nestjs/common';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';
import { FenologicModule } from '../fenologic/fenologic.module';
import { StationModule } from '../station/station.module';
import { CultiveModule } from '../cultive/cultive.module';

@Module({
  imports: [FenologicModule, StationModule, CultiveModule],
  controllers: [AnalyticController],
  providers: [AnalyticService],
})
export class AnalyticModule {}
