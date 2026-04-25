
import { Cultive } from "../../cultive/interfaces/cultive.interface";
import { Fenologic } from "../../fenologic/interfaces/fenologic.interface";
import { Station } from "../../station/interfaces/station.interface";

export interface Analytic {
    id: string,
    dateAnalytic: Date,

    tempOptMin: number,  // Límite inferior del rango óptimo
    tempOptMax: number,  // Límite superior del rango óptimo
    dates: Date[],  // Array de fechas para cada medición fenológica (hasta 10 fechas/semanas)
    fenologicValues: number[][],  // Array de arrays: cada semana tiene 10 valores
    fenologicId: string,
    fenologic: Fenologic,
    cultiveId: string,
    cultive: Cultive,
    stationId: string,
    station: Station,
}