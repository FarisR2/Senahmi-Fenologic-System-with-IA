import { Station } from "../../station/interfaces/station.interface";

export interface Cultive {
  id: number;
  nameCultive: string;
  stationId: number;
  station: Station;
  dayInterval: number;
}
