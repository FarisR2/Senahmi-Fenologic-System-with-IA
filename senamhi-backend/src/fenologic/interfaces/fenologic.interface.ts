import { Cultive } from '../../cultive/interfaces/cultive.interface';

export interface Fenologic {
  id: number;
  nameFenologic: string;
  abbreviation: string;
  cultiveId: number;
  cultive: Cultive;
}
