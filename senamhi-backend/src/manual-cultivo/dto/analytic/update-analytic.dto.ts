import { PartialType } from '@nestjs/mapped-types';
import { AnalyticDto } from './create-analytic.dto';

export class UpdateAnalyticDto extends PartialType(AnalyticDto) { }
