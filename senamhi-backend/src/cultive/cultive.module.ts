import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultiveController } from './cultive.controller';
import { CultiveService } from './cultive.service';
import { StationModule } from '../station/station.module';
import { Cultive } from './entities/cultive.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cultive]),
    forwardRef(() => StationModule)
  ],
  controllers: [CultiveController],
  providers: [CultiveService],
  exports: [CultiveService],
})
export class CultiveModule { }
