import { IsString, IsUUID } from 'class-validator';

export class CreateFenologicDto {
  @IsString()
  readonly nameFenologic: string;

  @IsString()
  readonly abbreviation: string;

  @IsUUID()
  readonly cultiveId: string;
}
