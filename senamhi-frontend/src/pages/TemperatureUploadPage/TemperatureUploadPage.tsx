import { useState, useEffect } from 'react';
import { useGet } from '../../hooks/useGet';
import { usePost } from '../../hooks/usePost';
import YearSelector from '../../components/Temperature/YearSelector/YearSelector';
import MonthGrid from '../../components/Temperature/MonthGrid/MonthGrid';
import './TemperatureUploadPage.css';
import { API_CONFIG } from '../../config/api.config';
import type { Station } from '../../interfaces';


export const TemperatureUploadPage = () => {

    const { data: stations } = useGet<Station[]>(API_CONFIG.ENDPOINTS.STATION);
    const { post } = usePost(`${API_CONFIG.ENDPOINTS.TEMPERATURE}/create-temperature-data`);
    const { post: postBulk } = usePost(`${API_CONFIG.ENDPOINTS.TEMPERATURE}/create-bulk-temperature-data`);

    const [selectedStationId, setSelectedStationId] = useState<number | string>('');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [uploadedMonths, setUploadedMonths] = useState<Set<number>>(new Set());
    const [uploadedFiles, setUploadedFiles] = useState<Record<number, string>>({});
    const [refreshKey, setRefreshKey] = useState(0);

    const isBulkMode = selectedStationId === 'BULK';

    useEffect(() => {
        if (selectedStationId && selectedYear && !isBulkMode) {
            fetchUploadedMonths();
        } else if (isBulkMode) {
            setUploadedMonths(new Set());
            setUploadedFiles({});
        }
    }, [selectedStationId, selectedYear, refreshKey, isBulkMode]);

    const fetchUploadedMonths = async () => {
        if (isBulkMode) return;
        try {
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEMPERATURE}/uploaded/${selectedStationId}/${selectedYear}`
            );
            if (response.ok) {
                const data = await response.json();
                setUploadedMonths(new Set(data.uploadedMonths || []));
                setUploadedFiles(data.files || {});
            } else {
                setUploadedMonths(new Set());
                setUploadedFiles({});
            }
        } catch {
            setUploadedMonths(new Set());
            setUploadedFiles({});
        }
    };

    const handleUpload = async (month: number, year: number, jsonData: any[][]) => {
        if (!selectedStationId) return;

        if (isBulkMode) {
            await handleBulkUpload(month, year, jsonData);
            return;
        }

        const selectedStation = stations?.find(s => s.id === Number(selectedStationId));
        if (!selectedStation) {
            alert('Estación no encontrada');
            throw new Error('Station not found');
        }

        const stationData = extractStationData(jsonData, selectedStation.nameStation);
        if (!stationData) {
            alert(`No se encontró la estación "${selectedStation.nameStation}" en el Excel`);
            throw new Error('Station not found in Excel');
        }

        await post({
            stationId: Number(selectedStationId),
            month,
            year,
            ...stationData
        });
    };

    const extractStationData = (jsonData: any[][], stationName: string) => {
        let stationColIndex = -1;
        for (let row = 0; row < Math.min(jsonData.length, 10); row++) { 
            for (let col = 0; col < jsonData[row]?.length; col++) {
                const cellValue = jsonData[row][col];
                if (cellValue && cellValue.toString().toUpperCase().trim().includes(stationName.toUpperCase().trim())) {
                    stationColIndex = col;
                    break;
                }
            }
            if (stationColIndex !== -1) break;
        }

        if (stationColIndex === -1) return null;

        let ppColIndex = -1;
        const startSearchCol = stationColIndex + 2;
        for (let r = 0; r < Math.min(jsonData.length, 15); r++) {
            const rowData = jsonData[r];
            if (!rowData) continue;
            for (let col = startSearchCol; col < rowData.length; col++) {
                const cellValue = rowData[col];
                if (cellValue && cellValue.toString().toUpperCase().trim() === 'PP') {
                    ppColIndex = col;
                    break;
                }
            }
            if (ppColIndex !== -1) break;
        }

        const tempMaxValues: number[] = [];
        const tempMinValues: number[] = [];
        const precipValues: number[] = [];

        for (let row = 0; row < jsonData.length; row++) {
            const rowData = jsonData[row];
            if (!rowData) continue;
            const dayValue = rowData[0];
            if (typeof dayValue === 'number' && dayValue >= 1 && dayValue <= 31) {
                tempMaxValues.push(parseFloat(rowData[stationColIndex]) || 0);
                tempMinValues.push(parseFloat(rowData[stationColIndex + 1]) || 0);
                precipValues.push(ppColIndex !== -1 ? parseFloat(rowData[ppColIndex]) || 0 : 0);
            }
        }

        while (tempMaxValues.length < 31) tempMaxValues.push(0);
        while (tempMinValues.length < 31) tempMinValues.push(0);
        while (precipValues.length < 31) precipValues.push(0);

        return {
            tempMaxValues: tempMaxValues.slice(0, 31),
            tempMinValues: tempMinValues.slice(0, 31),
            precipValues: precipValues.slice(0, 31),
        };
    };

    const handleBulkUpload = async (month: number, year: number, jsonData: any[][]) => {
        const stationsData: any[] = [];
        const headerRowIndex = 2; 
        const headerRow = jsonData[headerRowIndex] || [];
        
        for (let col = 1; col < headerRow.length; col++) {
            const cellValue = headerRow[col];
            if (cellValue && typeof cellValue === 'string' && !['PP', 'FECHA', 'DIA', 'TOTAL'].includes(cellValue.toUpperCase())) {
                const stationName = cellValue.trim();
                const data = extractStationData(jsonData, stationName);
                if (data) {
                    stationsData.push({
                        stationName,
                        ...data
                    });
                }
            }
        }

        if (stationsData.length === 0) {
            alert('No se detectaron estaciones en el Excel');
            return;
        }

        await postBulk({
            month,
            year,
            stationsData
        });
        
        alert(`Carga masiva completada: ${stationsData.length} estaciones procesadas.`);
    };

    const handleUploadSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="temperature-upload-container">
            <div className="temperature-upload-header">
                <h1>Carga de Temperaturas</h1>
                <p>Selecciona una estación y año, luego carga los archivos Excel para cada mes.</p>
            </div>

            <div className="station-selector-section">
                <label htmlFor="station" className="station-label">
                    Estación:
                </label>
                <select
                    id="station"
                    className="station-select"
                    value={selectedStationId}
                    onChange={(e) => setSelectedStationId(e.target.value)}
                >
                    <option value="">Selecciona una estación</option>
                    <option value="BULK" style={{ fontWeight: 'bold', color: '#27ae60' }}>
                        📦 TODAS LAS ESTACIONES (CARGA MASIVA)
                    </option>
                    <optgroup label="Estaciones Individuales">
                        {stations?.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.nameStation}
                            </option>
                        ))}
                    </optgroup>
                </select>
            </div>

            {selectedStationId && (
                <YearSelector
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                />
            )}

            {selectedStationId && (
                <MonthGrid
                    year={selectedYear}
                    stationId={selectedStationId}
                    uploadedMonths={uploadedMonths}
                    uploadedFiles={uploadedFiles}
                    onUploadSuccess={handleUploadSuccess}
                    onUpload={handleUpload}
                />
            )}

            {!selectedStationId && (
                <div className="empty-state">
                    <p>👆 Selecciona una estación para comenzar</p>
                </div>
            )}
        </div>
    );
};
