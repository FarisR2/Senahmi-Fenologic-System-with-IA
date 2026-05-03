import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateCultiveDto {
  @IsString()
  readonly nameCultive: string;

  @IsNumber()
  readonly stationId: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(30)
  readonly dayInterval?: number;
}
