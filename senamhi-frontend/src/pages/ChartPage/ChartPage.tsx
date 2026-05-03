import { useGet } from "../../hooks/useGet";
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
import { API_CONFIG } from "../../config/api.config";

interface Station {
    id: number;
    nameStation: string;
}

interface Cultive {
    id: number;
    nameCultive: string;
    stationId: number;
    dayInterval: number;
}

interface Analytic {
    id: number;
    dateAnalytic: string;
    tempOptMin: number;
    tempOptMax: number;
    dates: string[];
    fenologicValues: number[][];
    fenologicId: number;
    fenologic: {
        id: number;
        nameFenologic: string;
        abbreviation: string;
        cultiveId: number;
    };
    cultiveId: number;
    stationId: number;
}

const ChartPage = () => {
    const [selectedStationId, setSelectedStationId] = useState<number | string>('');
    const [selectedCultiveId, setSelectedCultiveId] = useState<number | string>('');

    const [startMonth, setStartMonth] = useState<number>(new Date().getMonth() + 1);
    const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
    const [endMonth, setEndMonth] = useState<number>(new Date().getMonth() + 1);
    const [endYear, setEndYear] = useState<number>(new Date().getFullYear());

    const { data: stations } = useGet<Station[]>(API_CONFIG.ENDPOINTS.STATION);
    const { data: cultives } = useGet<Cultive[]>(API_CONFIG.ENDPOINTS.CULTIVE);
    const { data: analytics } = useGet<Analytic[]>(
        selectedStationId ? `${API_CONFIG.ENDPOINTS.ANALYTIC}/by-station/${selectedStationId}` : "",
        !!selectedStationId
    );

    const filteredCultives = cultives?.filter(c => c.stationId === Number(selectedStationId)) || [];

    const filteredAnalytics = analytics?.filter(a => {
        if (!selectedCultiveId) return false;
        return a.cultiveId === Number(selectedCultiveId);
    }) || [];

    const uniqueFenologics = Array.from(
        new Set(filteredAnalytics.map(a => a.fenologic.abbreviation))
    );

    interface TemperatureData {
        month: number;
        year: number;
        tempMaxValues: number[];
        tempMinValues: number[];
        precipValues: number[];
    }

    const { data: temperatureDataList } = useGet<TemperatureData[]>(
        selectedStationId ? `${API_CONFIG.ENDPOINTS.TEMPERATURE}/by-station/${selectedStationId}` : "",
        !!selectedStationId
    );

    const chartData: any[] = [];

    const getTempForDate = (date: Date): { max: number, min: number } | null => {
        if (!temperatureDataList) return null;
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();
        const day = date.getUTCDate();
        const tempData = temperatureDataList.find(td => td.month === month && td.year === year);
        if (!tempData) return null;
        return { max: tempData.tempMaxValues[day - 1], min: tempData.tempMinValues[day - 1] };
    };

    const getPrecipForDate = (date: Date): number | null => {
        if (!temperatureDataList) return null;
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();
        const day = date.getUTCDate();
        const tempData = temperatureDataList.find(td => td.month === month && td.year === year);
        if (!tempData || !tempData.precipValues) return 0;
        return tempData.precipValues[day - 1] || 0;
    };

    const getAverageTempForDateRange = (startDate: Date, endDate: Date): { max: number, min: number } | null => {
        if (!temperatureDataList) return null;
        const temps: { max: number, min: number }[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const temp = getTempForDate(currentDate);
            if (temp) temps.push(temp);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        if (temps.length === 0) return null;
        return {
            max: Math.round(temps.reduce((s, t) => s + t.max, 0) / temps.length * 100) / 100,
            min: Math.round(temps.reduce((s, t) => s + t.min, 0) / temps.length * 100) / 100,
        };
    };

    const getPrecipSumForDateRange = (startDate: Date, endDate: Date): number => {
        if (!temperatureDataList) return 0;
        let totalPrecip = 0;
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const precip = getPrecipForDate(currentDate);
            if (precip !== null) totalPrecip += precip;
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return Math.round(totalPrecip * 100) / 100;
    };

    if (filteredAnalytics.length > 0) {
        const firstAnalytic = filteredAnalytics[0];
        const startDate = new Date(startYear, startMonth - 1, 1);
        const endDate = new Date(endYear, endMonth - 1, 31);
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            const realTemps = getTempForDate(currentDate);
            chartData.push({
                date: formattedDate,
                fullDate: new Date(currentDate),
                tempOptMin: firstAnalytic.tempOptMin,
                tempOptMax: firstAnalytic.tempOptMax,
                tempMax: realTemps?.max || 0,
                tempMin: realTemps?.min || 0,
                precip: 0,
                isPhenologicalPoint: false,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        filteredAnalytics.forEach(analytic => {
            const datesArray = analytic.dates || [];
            const cultive = cultives?.find(c => c.id === analytic.cultiveId);
            const dayInterval = cultive?.dayInterval || 7;

            if (datesArray.length === 0 && analytic.dateAnalytic) {
                const baseDate = new Date(analytic.dateAnalytic);
                for (let i = 0; i < 10; i++) {
                    const d = new Date(baseDate);
                    d.setDate(d.getDate() + (i * dayInterval));
                    datesArray.push(d.toISOString());
                }
            }

            datesArray.forEach((dateStr, index) => {
                const date = new Date(dateStr);
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                const existingPoint = chartData.find(p => p.date === formattedDate);

                if (existingPoint) {
                    let temps: { max: number, min: number } | null = null;
                    let precipSum = 0;

                    if (index === 0) {
                        temps = getTempForDate(date);
                        const precip = getPrecipForDate(date);
                        precipSum = precip !== null ? precip : 0;
                    } else {
                        const previousDate = new Date(datesArray[index - 1]);
                        const rangeStart = new Date(previousDate);
                        rangeStart.setDate(rangeStart.getDate() + 1);
                        temps = getAverageTempForDateRange(rangeStart, new Date(date));
                        precipSum = getPrecipSumForDateRange(rangeStart, new Date(date));
                    }

                    if (temps) {
                        existingPoint.tempMax = temps.max;
                        existingPoint.tempMin = temps.min;
                    }
                    existingPoint.precip = precipSum;
                    existingPoint.isPhenologicalPoint = true;

                    const weekValues = analytic.fenologicValues[index];
                    existingPoint[analytic.fenologic.abbreviation] = Array.isArray(weekValues)
                        ? weekValues.reduce((sum: number, v: number) => sum + v, 0)
                        : 0;
                } else {
                    console.warn(`No se encontró punto para: ${formattedDate} (${analytic.fenologic.abbreviation})`);
                }
            });
        });
    }

    chartData.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
    const displayedChartData = chartData.filter(p => p.isPhenologicalPoint);

    const selectedStation = stations?.find(s => s.id === selectedStationId);
    const selectedCultive = cultives?.find(c => c.id === selectedCultiveId);

    const getColorForFenologic = (index: number): string => {
        if (uniqueFenologics[index] === 'MD') return '#9b59b6';
        const colors = ['#e67e22', '#27ae60', '#f39c12', '#e74c3c', '#1abc9c', '#34495e', '#16a085', '#d35400', '#c0392b'];
        return colors[index % colors.length];
    };

    return (
        <div className="chart-page-container">
            <h1>Visualización de Análisis</h1>

            <div className="filters">
                <div className="filter-group">
                    <label htmlFor="station">Estación:</label>
                    <select id="station" value={selectedStationId} onChange={(e) => { setSelectedStationId(e.target.value); setSelectedCultiveId(''); }}>
                        <option value="">Selecciona una estación</option>
                        {stations?.map(s => <option key={s.id} value={s.id}>{s.nameStation}</option>)}
                    </select>
                </div>

                {selectedStationId && (
                    <div className="filter-group">
                        <label htmlFor="cultive">Cultivo:</label>
                        <select id="cultive" value={selectedCultiveId} onChange={(e) => setSelectedCultiveId(e.target.value)}>
                            <option value="">Selecciona un cultivo</option>
                            {filteredCultives.map(c => <option key={c.id} value={c.id}>{c.nameCultive}</option>)}
                        </select>
                    </div>
                )}

                {selectedStationId && selectedCultiveId && (
                    <div className="date-range-section">
                        <h3>Rango de Fechas del Análisis</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="filter-group">
                                <label>Mes Inicio:</label>
                                <select value={startMonth} onChange={(e) => setStartMonth(parseInt(e.target.value))}>
                                    {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Año Inicio:</label>
                                <select value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value))}>
                                    {Array.from({ length: 2026 - 2014 + 1 }, (_, i) => 2014 + i).map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Mes Fin:</label>
                                <select value={endMonth} onChange={(e) => setEndMonth(parseInt(e.target.value))}>
                                    {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Año Fin:</label>
                                <select value={endYear} onChange={(e) => setEndYear(parseInt(e.target.value))}>
                                    {Array.from({ length: 2026 - 2014 + 1 }, (_, i) => 2014 + i).map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {selectedStationId && selectedCultiveId && chartData.length > 0 && (
                <div className="chart-container">
                    <h2 className="chart-title">
                        ESTACIÓN: {selectedStation?.nameStation?.toUpperCase()}
                        <br />
                        <span className="chart-subtitle">Cultivo: {selectedCultive?.nameCultive}</span>
                    </h2>
                    <ResponsiveContainer width="100%" height={600}>
                        <ComposedChart data={displayedChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid stroke="#cccccc" strokeWidth={1} />
                            <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} tickFormatter={(v) => v}>
                                <Label value="Días" offset={60} position="insideTop" />
                            </XAxis>
                            <YAxis yAxisId="left" domain={[0, 40]} ticks={[0, 10, 20, 30, 40]}>
                                <Label value="Temperatura (°C)" angle={-90} position="insideLeft" />
                            </YAxis>
                            <YAxis yAxisId="right" orientation="right" domain={[-40, 40]} ticks={[-40, -20, 0, 20, 40]}>
                                <Label value="Observaciones" angle={90} position="insideRight" />
                            </YAxis>
                            <YAxis yAxisId="precip" orientation="left" domain={[0, 400]} ticks={[0, 100, 200, 300, 400]} hide={true} />
                            <Tooltip />
                            <Legend />
                            {displayedChartData.length > 0 && (
                                <ReferenceArea yAxisId="left" y1={displayedChartData[0]?.tempOptMin || 20} y2={displayedChartData[0]?.tempOptMax || 30} fill="#a8e6a1" fillOpacity={0.4} stroke="none" />
                            )}
                            <Bar yAxisId="precip" dataKey="precip" fill="#8DD1E1" name="Precip." />
                            <Line yAxisId="left" type="monotone" dataKey="tempMax" stroke="#e74c3c" strokeWidth={2} strokeDasharray="3 3" name="Temp. Máxima" dot={false} />
                            <Line yAxisId="left" type="monotone" dataKey="tempMin" stroke="#3498db" strokeWidth={2} strokeDasharray="3 3" name="Temp. Mínima" dot={false} />
                            {uniqueFenologics.map((fenologic, index) => (
                                <Line key={fenologic} yAxisId="right" type="monotone" dataKey={fenologic} stroke={getColorForFenologic(index)} strokeWidth={3} name={fenologic} dot={false} activeDot={{ r: 7 }} connectNulls />
                            ))}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}

            {selectedStationId && selectedCultiveId && chartData.length === 0 && (
                <div className="no-data">
                    <p>No hay datos disponibles para esta combinación de estación y cultivo.</p>
                    <p>Por favor, crea algunos análisis primero en la página de Crear Análisis.</p>
                </div>
            )}
        </div>
    );
};

export default ChartPage;
