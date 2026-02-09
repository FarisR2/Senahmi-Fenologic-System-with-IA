import { IsString, IsUUID, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateCultiveDto {
  @IsString()
  readonly nameCultive: string;

  @IsUUID()
  readonly stationId: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(30)
  readonly dayInterval?: number;
}
