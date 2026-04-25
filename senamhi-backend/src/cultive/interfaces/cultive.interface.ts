import { Station } from "../../station/interfaces/station.interface";

export interface Cultive {
  id: string;
  nameCultive: string;
  stationId: string;
  station: Station;
  dayInterval: number;
}
