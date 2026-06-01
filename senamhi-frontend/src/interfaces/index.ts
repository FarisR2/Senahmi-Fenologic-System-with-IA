export const Role = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type Role = (typeof Role)[keyof typeof Role];


export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface Station {
  id: number;
  nameStation: string;
}

export interface Cultive {
  id: number;
  nameCultive: string;
  stationId: number;
  dayInterval: number;
}

export interface Fenologic {
  id: number;
  nameFenologic: string;
  abbreviation: string;
  cultiveId: number;
}

export interface Analytic {
  id: number;
  dateAnalytic: string;
  tempOptMin: number;
  tempOptMax: number;
  dates: string[];
  fenologicValues: number[][];
  fenologicId: number;
  fenologic: Fenologic;
  cultiveId: number;
  stationId: number;
}

export interface TemperatureData {
  month: number;
  year: number;
  tempMaxValues: number[];
  tempMinValues: number[];
  precipValues: number[];
}
