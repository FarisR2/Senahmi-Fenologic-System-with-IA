import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';
import { FenologicModule } from '../fenologic/fenologic.module';
import { StationModule } from '../station/station.module';
import { CultiveModule } from '../cultive/cultive.module';
import { Analytic } from './entities/analytic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Analytic]),
    FenologicModule,
    StationModule,
    CultiveModule
  ],
  controllers: [AnalyticController],
  providers: [AnalyticService],
})
export class AnalyticModule { }
