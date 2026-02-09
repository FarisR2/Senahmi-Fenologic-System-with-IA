import { useState, useEffect } from 'react';
import { useGet } from '../hooks/useGet';
import { usePost } from '../hooks/usePost';
import YearSelector from '../components/Temperature/YearSelector';
import MonthGrid from '../components/Temperature/MonthGrid';
import './TemperatureUploadPage.css';

interface Station {
    id: string;
    nameStation: string;
}

export const TemperatureUploadPage = () => {
    const { data: stations } = useGet<Station[]>('http://localhost:3000/station');
    const { post } = usePost('http://localhost:3000/temperature-data/create-temperature-data');

    const [selectedStationId, setSelectedStationId] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [uploadedMonths, setUploadedMonths] = useState<Set<number>>(new Set());
    const [uploadedFiles, setUploadedFiles] = useState<Record<number, string>>({});
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch uploaded months when station or year changes
    useEffect(() => {
        if (selectedStationId && selectedYear) {
            fetchUploadedMonths();
        }
    }, [selectedStationId, selectedYear, refreshKey]);

    const fetchUploadedMonths = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/temperature-data/uploaded/${selectedStationId}/${selectedYear}`
            );

            if (response.ok) {
                const data = await response.json();
                setUploadedMonths(new Set(data.uploadedMonths || []));
                setUploadedFiles(data.files || {});
            } else {
                // Endpoint doesn't exist yet or no data
                setUploadedMonths(new Set());
                setUploadedFiles({});
            }
        } catch (error) {
            console.log('Could not fetch uploaded months (endpoint may not exist yet)');
            setUploadedMonths(new Set());
            setUploadedFiles({});
        }
    };

    const handleUpload = async (month: number, year: number, jsonData: any[][]) => {
        if (!selectedStationId) return;

        // Find selected station
        const selectedStation = stations?.find(s => s.id === selectedStationId);
        if (!selectedStation) {
            alert('Estación no encontrada');
            throw new Error('Station not found');
        }

        // Find station column
        let stationColIndex = -1;
        for (let row = 0; row < jsonData.length; row++) {
            for (let col = 0; col < jsonData[row]?.length; col++) {
                const cellValue = jsonData[row][col];
                if (cellValue && cellValue.toString().includes(selectedStation.nameStation)) {
                    stationColIndex = col;
                    break;
                }
            }
            if (stationColIndex !== -1) break;
        }

        if (stationColIndex === -1) {
            alert(`No se encontró la estación "${selectedStation.nameStation}" en el Excel`);
            throw new Error('Station not found in Excel');
        }

        // Find PP column
        let ppColIndex = -1;
        const startSearchCol = stationColIndex + 2;

        for (let row = 0; row < jsonData.length; row++) {
            for (let col = startSearchCol; col < jsonData[row]?.length; col++) {
                const cellValue = jsonData[row][col];
                if (cellValue && cellValue.toString().toUpperCase().trim() === 'PP') {
                    ppColIndex = col;
                    break;
                }
            }
            if (ppColIndex !== -1) break;
        }

        // Extract temperature and precipitation data
        const tempMaxValues: number[] = [];
        const tempMinValues: number[] = [];
        const precipValues: number[] = [];

        for (let row = 0; row < jsonData.length; row++) {
            const rowData = jsonData[row];
            if (!rowData) continue;

            const dayValue = rowData[0];
            if (typeof dayValue === 'number' && dayValue >= 1 && dayValue <= 31) {
                const tempMax = parseFloat(rowData[stationColIndex]) || 0;
                const tempMin = parseFloat(rowData[stationColIndex + 1]) || 0;

                tempMaxValues.push(tempMax);
                tempMinValues.push(tempMin);

                if (ppColIndex !== -1) {
                    const precip = parseFloat(rowData[ppColIndex]) || 0;
                    precipValues.push(precip);
                } else {
                    precipValues.push(0);
                }
            }
        }

        // Ensure 31 values
        while (tempMaxValues.length < 31) tempMaxValues.push(0);
        while (tempMinValues.length < 31) tempMinValues.push(0);
        while (precipValues.length < 31) precipValues.push(0);

        // Send to backend
        await post({
            stationId: selectedStationId,
            month,
            year,
            tempMaxValues: tempMaxValues.slice(0, 31),
            tempMinValues: tempMinValues.slice(0, 31),
            precipValues: precipValues.slice(0, 31),
        });
    };

    const handleUploadSuccess = () => {
        // Refresh uploaded months
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="temperature-upload-container">
            <div className="temperature-upload-header">
                <h1>Carga de Temperaturas</h1>
                <p>Selecciona una estación y año, luego carga los archivos Excel para cada mes.</p>
            </div>

            {/* Station Selector */}
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
                    {stations?.map(station => (
                        <option key={station.id} value={station.id}>
                            {station.nameStation}
                        </option>
                    ))}
                </select>
            </div>

            {/* Year Selector */}
            {selectedStationId && (
                <YearSelector
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                />
            )}

            {/* Month Grid */}
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
