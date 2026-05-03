import { IsNumber, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTemperatureDataDto {
    @IsNumber()
    stationId: number;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(12)
    month: number;

    @Type(() => Number)
    @IsNumber()
    @Min(2000)
    @Max(2100)
    year: number;

    @Type(() => Number)
    @IsArray()
    @IsNumber({}, { each: true })
    tempMaxValues: number[];  // Array de hasta 31 valores

    @Type(() => Number)
    @IsArray()
    @IsNumber({}, { each: true })
    tempMinValues: number[];  // Array de hasta 31 valores

    @Type(() => Number)
    @IsArray()
    @IsNumber({}, { each: true })
    precipValues: number[];  // Array de hasta 31 valores de precipitación
}

