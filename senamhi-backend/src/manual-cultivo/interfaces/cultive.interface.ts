import { Station } from "./station.interface";

export interface Cultive {
  id: string;
  nameCultive: string;
  stationId: string;
  station: Station;
  dayInterval: number;
}
