import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Station } from '../station/entities/station.entity';
import { Cultive } from '../cultive/entities/cultive.entity';
import { Fenologic } from '../fenologic/entities/fenologic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Station, Cultive, Fenologic])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
