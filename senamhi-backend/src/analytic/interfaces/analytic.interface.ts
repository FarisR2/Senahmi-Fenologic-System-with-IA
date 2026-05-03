
import { Cultive } from "../../cultive/interfaces/cultive.interface";
import { Fenologic } from "../../fenologic/interfaces/fenologic.interface";
import { Station } from "../../station/interfaces/station.interface";

export interface Analytic {
    id: number,
    dateAnalytic: Date,

    tempOptMin: number,  // Límite inferior del rango óptimo
    tempOptMax: number,  // Límite superior del rango óptimo
    dates: Date[],  // Array de fechas para cada medición fenológica (hasta 10 fechas/semanas)
    fenologicValues: number[][],  // Array de arrays: cada semana tiene 10 valores
    fenologicId: number,
    fenologic: Fenologic,
    cultiveId: number,
    cultive: Cultive,
    stationId: number,
    station: Station,
}