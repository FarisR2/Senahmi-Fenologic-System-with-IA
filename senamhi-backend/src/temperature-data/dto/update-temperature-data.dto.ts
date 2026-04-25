import { PartialType } from '@nestjs/mapped-types';
import { CreateTemperatureDataDto } from './create-temperature-data.dto';

export class UpdateTemperatureDataDto extends PartialType(CreateTemperatureDataDto) { }
