import { Module, forwardRef } from '@nestjs/common';
import { CultiveController } from './cultive.controller';
import { CultiveService } from './cultive.service';
import { StationModule } from '../station/station.module';

@Module({
  imports: [forwardRef(() => StationModule)],
  controllers: [CultiveController],
  providers: [CultiveService],
  exports: [CultiveService],
})
export class CultiveModule {}
