import { IsString, IsNumber } from 'class-validator';

export class CreateFenologicDto {
  @IsString()
  readonly nameFenologic: string;

  @IsString()
  readonly abbreviation: string;

  @IsNumber()
  readonly cultiveId: number;
}
