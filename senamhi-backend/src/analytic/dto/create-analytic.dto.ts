import { Type } from "class-transformer";
import { IsArray, IsDate, IsNumber, IsString } from "class-validator";

export class AnalyticDto {
    @Type(() => Date) // Convierte el string de la fecha a objeto Date
    @IsDate()
    dateAnalytic: Date;

    @Type(() => Number)
    @IsNumber()
    tempOptMin: number;  // Límite inferior del rango óptimo

    @Type(() => Number)
    @IsNumber()
    tempOptMax: number;  // Límite superior del rango óptimo

    @Type(() => Date)
    @IsArray()
    dates: Date[];  // Array de fechas (hasta 10)

    @Type(() => Number)
    @IsArray()
    fenologicValues: number[][];  // Array de arrays: [semana][10 valores por semana]

    @IsNumber()
    fenologicId: number;

    @IsNumber()
    cultiveId: number;

    @IsNumber()
    stationId: number;
}