import { IsNumber } from 'class-validator';

export class StationCropDto {
  @IsNumber()
  readonly cultiveId: number;

  @IsNumber()
  readonly stationId: number;
}
