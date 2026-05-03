import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationController } from './station.controller';
import { StationService } from './station.service';
import { StationCropService } from './station-crop.service';
import { CultiveModule } from '../cultive/cultive.module';
import { forwardRef } from '@nestjs/common';
import { Station } from './entities/station.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station]),
    forwardRef(() => CultiveModule)
  ],
  controllers: [StationController],
  providers: [StationService, StationCropService],
  exports: [StationService, StationCropService],
})
export class StationModule { }
