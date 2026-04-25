import { Cultive } from '../../cultive/interfaces/cultive.interface';

export interface Fenologic {
  id: string;
  nameFenologic: string;
  abbreviation: string;
  cultiveId: string;
  cultive: Cultive;
}
