import { Cultive } from '../../cultive/interfaces/cultive.interface';
import { Station } from './station.interface';

export interface StationCrop {
  id: string;
  stationId: string;
  station: Station;
  cultiveId: string;
  cultive: Cultive;
}
