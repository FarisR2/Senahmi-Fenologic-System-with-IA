import { IsString } from 'class-validator';

export class CreateStationDto {
  @IsString()
  readonly nameStation: string;
}
