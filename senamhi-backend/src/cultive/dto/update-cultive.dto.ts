import { PartialType } from '@nestjs/mapped-types';
import { CreateCultiveDto } from './create-cultive.dto';

export class UpdateCultiveDto extends PartialType(CreateCultiveDto) {}
