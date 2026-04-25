import { Module } from '@nestjs/common';
import { StationController } from './station.controller';
import { StationService } from './station.service';
import { StationCropService } from './station-crop.service';
import { CultiveModule } from '../cultive/cultive.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [forwardRef(() => CultiveModule)],
  controllers: [StationController],
  providers: [StationService, StationCropService],
  exports: [StationService, StationCropService],
})
export class StationModule {}
