import { Module } from '@nestjs/common';
import { FenologicController } from './fenologic.controller';
import { FenologicService } from './fenologic.service';
import { CultiveModule } from '../cultive/cultive.module';

@Module({
  imports: [CultiveModule],
  controllers: [FenologicController],
  providers: [FenologicService],
  exports: [FenologicService],
})
export class FenologicModule {}
