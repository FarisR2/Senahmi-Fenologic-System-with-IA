import { Module } from '@nestjs/common';
import { ManualCultivoModule } from './manual-cultivo/manual-cultivo.module';

@Module({
  imports: [ManualCultivoModule],
  providers: [],
})
export class AppModule {}
