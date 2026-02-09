import { Cultive } from './cultive.interface';

export interface Fenologic {
  id: string;
  nameFenologic: string;
  abbreviation: string;
  cultiveId: string;
  cultive: Cultive;
}
