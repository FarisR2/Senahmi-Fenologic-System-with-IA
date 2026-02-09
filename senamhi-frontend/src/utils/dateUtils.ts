/**
 * Utilidades para manejo de fechas
 * Evita problemas de zona horaria al trabajar con fechas YYYY-MM-DD
 */

/**
 * Parsea una fecha YYYY-MM-DD y crea un objeto Date a mediodía hora local
 * Esto evita problemas de zona horaria que causan desfase de días
 */
export function parseDateSafe(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Formatea un objeto Date como YYYY-MM-DD
 */
export function formatDateToYYYYMMDD(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

/**
 * Calcula fechas automáticamente sumando días desde una fecha base
 * @param startDate Fecha inicial en formato YYYY-MM-DD
 * @param count Número total de fechas a generar
 * @param dayInterval Intervalo de días entre fechas (default: 7)
 * @returns Array de fechas en formato YYYY-MM-DD
 */
export function calculateWeeklyDates(startDate: string, count: number, dayInterval: number = 7): string[] {
    const dates: string[] = [startDate];
    const baseDate = parseDateSafe(startDate);

    for (let i = 1; i < count; i++) {
        const nextDate = new Date(baseDate);
        nextDate.setDate(baseDate.getDate() + (i * dayInterval));
        dates.push(formatDateToYYYYMMDD(nextDate));
    }

    return dates;
}

/**
 * Convierte una fecha YYYY-MM-DD a ISO string con hora a mediodía UTC
 * Esto previene desfase de días al guardar en backend
 */
export function dateToISOWithNoonUTC(dateString: string): string {
    const date = new Date(dateString);
    date.setUTCHours(12, 0, 0, 0);
    return date.toISOString();
}

/**
 * Convierte un array de fechas YYYY-MM-DD a ISO strings con mediodía UTC
 */
export function datesToISOArray(dates: string[]): string[] {
    return dates.map(d => dateToISOWithNoonUTC(d));
}
