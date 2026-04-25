import { PartialType } from '@nestjs/mapped-types';
import { CreateFenologicDto } from './create-fenologic.dto';

export class UpdateFenologicDto extends PartialType(CreateFenologicDto) {}
