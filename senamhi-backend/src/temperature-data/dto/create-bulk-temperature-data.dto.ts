import { IsNumber, IsArray, Min, Max, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StationDataDto {
    @IsString()
    stationName: string;

    @Type(() => Number)
    @IsArray()
    @IsNumber({}, { each: true })
    tempMaxValues: number[];

    @Type(() => Number)
    @IsArray()
    @IsNumber({}, { each: true })
    tempMinValues: number[];

    @Type(() => Number)
    @IsArray()
    @IsNumber({}, { each: true })
    precipValues: number[];
}

export class CreateBulkTemperatureDataDto {
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

    @ValidateNested({ each: true })
    @Type(() => StationDataDto)
    stationsData: StationDataDto[];
}
