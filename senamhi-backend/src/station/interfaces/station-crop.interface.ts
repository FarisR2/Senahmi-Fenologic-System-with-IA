import { Cultive } from '../../cultive/interfaces/cultive.interface';
import { Station } from './station.interface';

export interface StationCrop {
  id: number;
  stationId: number;
  station: Station;
  cultiveId: number;
  cultive: Cultive;
}
