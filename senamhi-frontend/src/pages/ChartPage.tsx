import { useGet } from "../hooks/useGet";
import { useState } from "react";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
    Area,
    ReferenceArea
} from 'recharts';
import './ChartPage.css';

interface Station {
    id: string;
    nameStation: string;
}

interface Cultive {
    id: string;
    nameCultive: string;
    stationId: string;
    dayInterval: number;
}

interface Analytic {
    id: string;
    dateAnalytic: string;
    tempOptMin: number;
    tempOptMax: number;
    dates: string[]; // Fechas de los puntos fenológicos
    fenologicValues: number[][]; // 2D array: [semana][10 valores]
    fenologicId: string;
    fenologic: {
        id: string;
        nameFenologic: string;
        abbreviation: string;
        cultiveId: string;
    };
    cultiveId: string;
    stationId: string;
}

const ChartPage = () => {
    const [selectedStationId, setSelectedStationId] = useState<string>('');
    const [selectedCultiveId, setSelectedCultiveId] = useState<string>('');

    // Date range selection (UI only, not stored in analytic)
    const [startMonth, setStartMonth] = useState<number>(new Date().getMonth() + 1);
    const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
    const [endMonth, setEndMonth] = useState<number>(new Date().getMonth() + 1);
    const [endYear, setEndYear] = useState<number>(new Date().getFullYear());

    const { data: stations } = useGet<Station[]>("http://localhost:3000/station");
    const { data: cultives } = useGet<Cultive[]>("http://localhost:3000/cultive");
    const { data: analytics } = useGet<Analytic[]>(
        selectedStationId ? `http://localhost:3000/analytic/by-station/${selectedStationId}` : "",
        !!selectedStationId
    );

    // Filtrar cultivos por station
    const filteredCultives = cultives?.filter(c => c.stationId === selectedStationId) || [];

    // Filtrar analytics por cultive seleccionado
    const filteredAnalytics = analytics?.filter(a => {
        if (!selectedCultiveId) return false;
        return a.cultiveId === selectedCultiveId;
    }) || [];

    // Obtener todas las fenologías únicas
    const uniqueFenologics = Array.from(
        new Set(filteredAnalytics.map(a => a.fenologic.abbreviation))
    );

    // Transformar datos para el gráfico
    // 10 puntos fenológicos cada 7 días, temperaturas del array de 62 días
    interface TemperatureData {
        month: number;
        year: number;
        tempMaxValues: number[];
        tempMinValues: number[];
        precipValues: number[];  // NUEVO: Precipitación
    }

    const { data: temperatureDataList } = useGet<TemperatureData[]>(
        selectedStationId ? `http://localhost:3000/temperature-data/by-station/${selectedStationId}` : "",
        !!selectedStationId
    );

    // Transformar datos para el gráfico
    const chartData: any[] = [];

    // Función helper para obtener temperatura de una fecha específica
    const getTempForDate = (date: Date): { max: number, min: number } | null => {
        if (!temperatureDataList) return null;

        const month = date.getUTCMonth() + 1; // 1-12
        const year = date.getUTCFullYear();
        const day = date.getUTCDate(); // 1-31

        const tempData = temperatureDataList.find(td => td.month === month && td.year === year);
        if (!tempData) return null;

        // Arrays son 0-indexed, día 1 es índice 0
        const max = tempData.tempMaxValues[day - 1];
        const min = tempData.tempMinValues[day - 1];

        return { max, min };
    };

    // Función helper para obtener precipitación de una fecha específica
    const getPrecipForDate = (date: Date): number | null => {
        if (!temperatureDataList) return null;

        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();
        const day = date.getUTCDate();

        const tempData = temperatureDataList.find(td => td.month === month && td.year === year);
        if (!tempData) return null;

        // Validar que precipValues existe (para datos viejos que no lo tienen)
        if (!tempData.precipValues) return 0;

        const precipValue = tempData.precipValues[day - 1] || 0;
        console.log(`Fecha: ${day}/${month}, Índice array: ${day - 1}, Valor PP: ${precipValue}`);

        return precipValue;
    };

    // Función para calcular promedio de temperaturas en un rango de fechas
    const getAverageTempForDateRange = (startDate: Date, endDate: Date): { max: number, min: number } | null => {
        if (!temperatureDataList) return null;

        const temps: { max: number, min: number }[] = [];
        const currentDate = new Date(startDate);

        // Iterar por cada día en el rango
        while (currentDate <= endDate) {
            const temp = getTempForDate(currentDate);
            if (temp) {
                temps.push(temp);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Si no hay datos, retornar null
        if (temps.length === 0) return null;

        // Calcular promedios
        const avgMax = temps.reduce((sum, t) => sum + t.max, 0) / temps.length;
        const avgMin = temps.reduce((sum, t) => sum + t.min, 0) / temps.length;

        return {
            max: Math.round(avgMax * 100) / 100,
            min: Math.round(avgMin * 100) / 100
        };
    };

    // Función para calcular suma de precipitación en un rango de fechas
    const getPrecipSumForDateRange = (startDate: Date, endDate: Date): number => {
        if (!temperatureDataList) return 0;

        let totalPrecip = 0;
        const currentDate = new Date(startDate);

        // Iterar por cada día en el rango
        while (currentDate <= endDate) {
            const precip = getPrecipForDate(currentDate);
            if (precip !== null) {
                totalPrecip += precip;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Redondear a 2 decimales
        return Math.round(totalPrecip * 100) / 100;
    };

    // Generar timeline continuo basado en el rango de fechas seleccionado en la UI
    if (filteredAnalytics.length > 0) {
        const firstAnalytic = filteredAnalytics[0];

        // Generar todos los días en el rango SELECCIONADO POR EL USUARIO
        const startDate = new Date(startYear, startMonth - 1, 1);
        const endDate = new Date(endYear, endMonth - 1, 31); // Último día posible del mes final

        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

            // Buscar temperaturas reales para este día
            const realTemps = getTempForDate(currentDate);

            const dataPoint = {
                date: formattedDate,
                fullDate: new Date(currentDate), // Para ordenamiento
                tempOptMin: firstAnalytic.tempOptMin,
                tempOptMax: firstAnalytic.tempOptMax,
                tempMax: realTemps?.max || 0,
                tempMin: realTemps?.min || 0,
                precip: 0, // Inicializar en 0, solo se mostrará en puntos fenológicos
                isPhenologicalPoint: false, // Se marcará como true en puntos fenológicos
            };

            chartData.push(dataPoint);

            // Avanzar al siguiente día
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Ahora agregar puntos fenológicos sobre el timeline continuo
        filteredAnalytics.forEach(analytic => {
            const datesArray = analytic.dates || [];

            // Obtener cultivo para saber el intervalo
            const cultive = cultives?.find(c => c.id === analytic.cultiveId);
            const dayInterval = cultive?.dayInterval || 7;

            // Si no hay fechas guardadas (datos antiguos), generar fechas como antes
            if (datesArray.length === 0 && analytic.dateAnalytic) {
                const baseDate = new Date(analytic.dateAnalytic);
                for (let i = 0; i < 10; i++) {
                    const d = new Date(baseDate);
                    d.setDate(d.getDate() + (i * dayInterval));
                    datesArray.push(d.toISOString());
                }
            }

            datesArray.forEach((dateStr, index) => {
                // Parsear fecha - crear objeto Date y extraer componentes locales
                const date = new Date(dateStr);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;

                // Buscar el punto en el chartData
                const existingPoint = chartData.find(p => p.date === formattedDate);

                if (existingPoint) {
                    // Calcular temperaturas según el índice
                    let temps: { max: number, min: number } | null = null;
                    let precipSum = 0;

                    if (index === 0) {
                        // Primer punto: usar temperatura y precipitación exacta del día
                        temps = getTempForDate(date);
                        const precip = getPrecipForDate(date);
                        precipSum = precip !== null ? precip : 0;
                    } else {
                        // Puntos siguientes: calcular promedio de temp y suma de precip del rango
                        const previousDate = new Date(datesArray[index - 1]);

                        // Rango: desde (fecha_anterior + 1 día) hasta (fecha_actual)
                        const rangeStart = new Date(previousDate);
                        rangeStart.setDate(rangeStart.getDate() + 1);
                        const rangeEnd = new Date(date);

                        temps = getAverageTempForDateRange(rangeStart, rangeEnd);
                        precipSum = getPrecipSumForDateRange(rangeStart, rangeEnd);
                    }

                    // Sobrescribir temperaturas y precipitación del punto con las calculadas
                    if (temps) {
                        existingPoint.tempMax = temps.max;
                        existingPoint.tempMin = temps.min;
                    }
                    existingPoint.precip = precipSum;
                    existingPoint.isPhenologicalPoint = true; // Marcar como punto fenológico

                    // Contar valores no-cero para esta semana
                    const weekValues = analytic.fenologicValues[index];
                    const countNonZero = Array.isArray(weekValues)
                        ? weekValues.filter((v: number) => v !== 0).length
                        : 0;

                    // Asignar el conteo al punto del gráfico
                    existingPoint[analytic.fenologic.abbreviation] = countNonZero;
                } else {
                    console.warn(`No se encontró punto en chartData para la fecha: ${formattedDate} (fenología: ${analytic.fenologic.abbreviation})`);
                }
            });
        });
    }

    // Ordenar por fecha real (ya debería estar ordenado, pero por seguridad)
    chartData.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

    // Filtrar para mostrar solo puntos fenológicos
    const displayedChartData = chartData.filter(point => point.isPhenologicalPoint);

    const selectedStation = stations?.find(s => s.id === selectedStationId);
    const selectedCultive = cultives?.find(c => c.id === selectedCultiveId);

    // Función para generar colores dinámicamente
    const getColorForFenologic = (index: number): string => {
        // Si la fenología es MD, siempre morado
        const fenologicName = uniqueFenologics[index];
        if (fenologicName === 'MD') {
            return '#9b59b6'; // Morado para MD
        }

        const colors = [
            '#e67e22', // Naranja
            '#27ae60', // Verde
            '#f39c12', // Amarillo
            '#e74c3c', // Rojo
            '#1abc9c', // Turquesa
            '#34495e', // Gris oscuro
            '#16a085', // Verde azulado
            '#d35400', // Naranja oscuro
            '#c0392b', // Rojo oscuro
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="chart-page-container">
            <h1>Visualización de Análisis</h1>

            <div className="filters">
                <div className="filter-group">
                    <label htmlFor="station">Estación:</label>
                    <select
                        id="station"
                        value={selectedStationId}
                        onChange={(e) => {
                            setSelectedStationId(e.target.value);
                            setSelectedCultiveId('');
                        }}
                    >
                        <option value="">Selecciona una estación</option>
                        {stations?.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.nameStation}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedStationId && (
                    <div className="filter-group">
                        <label htmlFor="cultive">Cultivo:</label>
                        <select
                            id="cultive"
                            value={selectedCultiveId}
                            onChange={(e) => setSelectedCultiveId(e.target.value)}
                        >
                            <option value="">Selecciona un cultivo</option>
                            {filteredCultives.map(cultive => (
                                <option key={cultive.id} value={cultive.id}>
                                    {cultive.nameCultive}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Date Range Selection */}
                {selectedStationId && selectedCultiveId && (
                    <div className="date-range-section">
                        <h3>Rango de Fechas del Análisis</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="filter-group">
                                <label>Mes Inicio:</label>
                                <select
                                    value={startMonth}
                                    onChange={(e) => setStartMonth(parseInt(e.target.value))}
                                >
                                    <option value={1}>Enero</option>
                                    <option value={2}>Febrero</option>
                                    <option value={3}>Marzo</option>
                                    <option value={4}>Abril</option>
                                    <option value={5}>Mayo</option>
                                    <option value={6}>Junio</option>
                                    <option value={7}>Julio</option>
                                    <option value={8}>Agosto</option>
                                    <option value={9}>Septiembre</option>
                                    <option value={10}>Octubre</option>
                                    <option value={11}>Noviembre</option>
                                    <option value={12}>Diciembre</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Año Inicio:</label>
                                <select
                                    value={startYear}
                                    onChange={(e) => setStartYear(parseInt(e.target.value))}
                                >
                                    {Array.from({ length: 2026 - 2014 + 1 }, (_, i) => 2014 + i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Mes Fin:</label>
                                <select
                                    value={endMonth}
                                    onChange={(e) => setEndMonth(parseInt(e.target.value))}
                                >
                                    <option value={1}>Enero</option>
                                    <option value={2}>Febrero</option>
                                    <option value={3}>Marzo</option>
                                    <option value={4}>Abril</option>
                                    <option value={5}>Mayo</option>
                                    <option value={6}>Junio</option>
                                    <option value={7}>Julio</option>
                                    <option value={8}>Agosto</option>
                                    <option value={9}>Septiembre</option>
                                    <option value={10}>Octubre</option>
                                    <option value={11}>Noviembre</option>
                                    <option value={12}>Diciembre</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Año Fin:</label>
                                <select
                                    value={endYear}
                                    onChange={(e) => setEndYear(parseInt(e.target.value))}
                                >
                                    {Array.from({ length: 2026 - 2014 + 1 }, (_, i) => 2014 + i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {
                selectedStationId && selectedCultiveId && chartData.length > 0 && (
                    <div className="chart-container">
                        <h2 className="chart-title">
                            ESTACIÓN: {selectedStation?.nameStation?.toUpperCase()}
                            <br />
                            <span className="chart-subtitle">Cultivo: {selectedCultive?.nameCultive}</span>
                        </h2>

                        <ResponsiveContainer width="100%" height={600}>
                            <ComposedChart
                                data={displayedChartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                                <CartesianGrid stroke="#cccccc" strokeWidth={1} />
                                <XAxis
                                    dataKey="date"
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    tickFormatter={(value) => {
                                        // Ahora todos los puntos son fenológicos, mostrar todas las fechas
                                        return value;
                                    }}
                                >
                                    <Label value="Días" offset={60} position="insideTop" />
                                </XAxis>
                                <YAxis yAxisId="left" domain={[0, 40]} ticks={[0, 10, 20, 30, 40]}>
                                    <Label value="Temperatura (°C)" angle={-90} position="insideLeft" />
                                </YAxis>
                                <YAxis yAxisId="right" orientation="right" domain={[-40, 40]} ticks={[-40, -20, 0, 20, 40]}>
                                    <Label value="Observaciones" angle={90} position="insideRight" />
                                </YAxis>
                                <YAxis
                                    yAxisId="precip"
                                    orientation="left"
                                    domain={[0, 400]}
                                    ticks={[0, 100, 200, 300, 400]}
                                    hide={true}
                                />
                                <Tooltip />
                                <Legend />

                                {/* Área verde sombreada entre Temp. Óptima Min y Max */}
                                {displayedChartData.length > 0 && (
                                    <ReferenceArea
                                        yAxisId="left"
                                        y1={displayedChartData[0]?.tempOptMin || 20}
                                        y2={displayedChartData[0]?.tempOptMax || 30}
                                        fill="#a8e6a1"
                                        fillOpacity={0.4}
                                        stroke="none"
                                    />
                                )}

                                {/* Barras de precipitación */}
                                <Bar
                                    yAxisId="precip"
                                    dataKey="precip"
                                    fill="#8DD1E1"
                                    name="Precip."
                                />

                                {/* Líneas de temperatura - sin puntos para visualización limpia */}
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="tempMax"
                                    stroke="#e74c3c"
                                    strokeWidth={2}
                                    strokeDasharray="3 3"
                                    name="Temp. Máxima"
                                    dot={false}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="tempMin"
                                    stroke="#3498db"
                                    strokeWidth={2}
                                    strokeDasharray="3 3"
                                    name="Temp. Mínima"
                                    dot={false}
                                />

                                {/* Líneas dinámicas para cada fenología - puntos solo en hover */}
                                {uniqueFenologics.map((fenologic, index) => (
                                    <Line
                                        key={fenologic}
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey={fenologic}
                                        stroke={getColorForFenologic(index)}
                                        strokeWidth={3}
                                        name={fenologic}
                                        dot={false}
                                        activeDot={{ r: 7 }}
                                        connectNulls
                                    />
                                ))}

                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )
            }

            {
                selectedStationId && selectedCultiveId && chartData.length === 0 && (
                    <div className="no-data">
                        <p>No hay datos disponibles para esta combinación de estación y cultivo.</p>
                        <p>Por favor, crea algunos análisis primero en la página de Crear Análisis.</p>
                    </div>
                )
            }
        </div >
    );
};

export default ChartPage;
