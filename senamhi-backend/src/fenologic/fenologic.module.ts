import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FenologicController } from './fenologic.controller';
import { FenologicService } from './fenologic.service';
import { CultiveModule } from '../cultive/cultive.module';
import { Fenologic } from './entities/fenologic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fenologic]),
    CultiveModule
  ],
  controllers: [FenologicController],
  providers: [FenologicService],
  exports: [FenologicService],
})
export class FenologicModule { }
