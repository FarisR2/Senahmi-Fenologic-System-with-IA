
import { Station } from "./station.interface";

export interface TemperatureData {
    id: string;
    stationId: string;
    station: Station;
    month: number;  // 1-12
    year: number;   // 2025, etc.
    // Arrays de 31 elementos (días del mes)
    tempMaxValues: number[];  // Temperaturas máximas por día
    tempMinValues: number[];  // Temperaturas mínimas por día
    precipValues: number[];   // Precipitación por día (columna PP del Excel)
}
