
import { Station } from "../../station/interfaces/station.interface";

export interface TemperatureData {
    id: number;
    stationId: number;
    station: Station;
    month: number;  // 1-12
    year: number;   // 2025, etc.
    // Arrays de 31 elementos (días del mes)
    tempMaxValues: number[];  // Temperaturas máximas por día
    tempMinValues: number[];  // Temperaturas mínimas por día
    precipValues: number[];   // Precipitación por día (columna PP del Excel)
}
