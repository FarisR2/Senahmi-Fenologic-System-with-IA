import { IsUUID } from 'class-validator';

export class StationCropDto {
  @IsUUID()
  readonly cultiveId: string;

  @IsUUID()
  readonly stationId: string;
}
