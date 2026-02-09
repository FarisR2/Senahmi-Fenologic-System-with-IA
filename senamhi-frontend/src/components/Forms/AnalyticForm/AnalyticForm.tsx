import './AnalyticForm.css';
import { useState } from 'react';
import { calculateWeeklyDates, datesToISOArray } from '../../../utils/dateUtils';

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

interface Fenologic {
    id: string;
    nameFenologic: string;
    abbreviation: string;
    cultiveId: string;
}

interface Props {
    onPost: (data: any) => Promise<void>;
    showSuccess: boolean;
    stations: Station[];
    cultives: Cultive[];
    fenologics: Fenologic[];
}

type Step = 'basic' | 'select' | 'count' | 'entry';

export const AnalyticForm = ({ onPost, showSuccess, stations, cultives, fenologics }: Props) => {
    const [currentStep, setCurrentStep] = useState<Step>('basic');
    const [selectedStationId, setSelectedStationId] = useState<string>('');
    const [selectedCultiveId, setSelectedCultiveId] = useState<string>('');

    // Step 1 data
    const [step1Data, setStep1Data] = useState({
        dateAnalytic: '',
        tempOptMin: '',
        tempOptMax: '',
    });

    // Week tracking per fenologic ID (cada fenología tiene su propio límite de 10)
    const [weeksPerFenologic, setWeeksPerFenologic] = useState<Record<string, number>>({});
    const MAX_WEEKS = 10;

    // Step 2: Selected phenological value
    const [selectedFenologicId, setSelectedFenologicId] = useState<string>('');

    // Step 3: Week count
    const [weekCount, setWeekCount] = useState<number>(0);

    // Step 4: Data entry
    const [rowDates, setRowDates] = useState<string[]>([]);
    const [rowValues, setRowValues] = useState<number[][]>([]);

    // Filtrar cultivos por station seleccionada
    const filteredCultives = cultives.filter(c => c.stationId === selectedStationId);

    // Filtrar fenologías por cultivo seleccionado
    const filteredFenologics = fenologics.filter(f => f.cultiveId === selectedCultiveId);

    // Obtener cultivo seleccionado para usar su intervalo de días
    const selectedCultive = cultives.find(c => c.id === selectedCultiveId);
    const dayInterval = selectedCultive?.dayInterval || 7;

    // Auto-calcular fecha (usando intervalo del cultivo)
    const handleDateChange = (index: number, value: string) => {
        const newDates = [...rowDates];
        newDates[index] = value;

        // Auto-calcular las siguientes fechas usando intervalo del cultivo
        if (value && index < weekCount - 1) {
            const calculatedDates = calculateWeeklyDates(value, weekCount - index, dayInterval);
            // Reemplazar desde index+1 en adelante
            for (let i = 1; i < calculatedDates.length; i++) {
                newDates[index + i] = calculatedDates[i];
            }
        }

        setRowDates(newDates);
    };

    // Manejar cambio de valor individual (fila, columna)
    const handleValueChange = (weekIndex: number, valueIndex: number, value: string) => {
        const newValues = [...rowValues];
        if (!newValues[weekIndex]) {
            newValues[weekIndex] = Array(10).fill(0);
        }
        newValues[weekIndex][valueIndex] = parseFloat(value) || 0;
        setRowValues(newValues);
    };

    // Step 1 -> Step 2
    const handleNext = () => {
        if (selectedStationId && selectedCultiveId) {
            setCurrentStep('select');
        }
    };

    // Step 2 -> Step 3: Seleccionar fenología
    const handleSelectFenologic = (fenologicId: string) => {
        setSelectedFenologicId(fenologicId);
        setCurrentStep('count');
    };

    // Step 3 -> Step 4: Ingresar cantidad de semanas
    const handleSetWeekCount = () => {
        const currentWeeks = weeksPerFenologic[selectedFenologicId] || 0;
        const availableWeeks = MAX_WEEKS - currentWeeks;

        if (weekCount > 0 && weekCount <= availableWeeks) {
            // Inicializar arrays
            setRowDates(Array(weekCount).fill(''));
            setRowValues(Array(weekCount).fill(null).map(() => Array(10).fill(0)));
            setCurrentStep('entry');
        } else {
            alert(`Por favor ingresa un número entre 1 y ${availableWeeks} (semanas disponibles para esta fenología)`);
        }
    };

    // Guardar y continuar
    const handleSaveAndContinue = async () => {
        // Validar que todas las fechas estén llenas
        if (rowDates.some(d => !d)) {
            alert('Por favor completa todas las fechas');
            return;
        }

        // Validar fechas (deben tener el intervalo correcto según el cultivo)
        for (let i = 0; i < rowDates.length - 1; i++) {
            const date1 = new Date(rowDates[i]);
            const date2 = new Date(rowDates[i + 1]);
            const diffDays = Math.round((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays !== dayInterval) {
                alert(`Error: La fecha de la semana ${i + 2} debe estar ${dayInterval} días después de la semana ${i + 1}`);
                return;
            }
        }

        try {
            // Construir objeto analytic completo
            const analyticData = {
                dateAnalytic: step1Data.dateAnalytic,
                stationId: selectedStationId,
                cultiveId: selectedCultiveId,
                tempOptMin: parseFloat(step1Data.tempOptMin),
                tempOptMax: parseFloat(step1Data.tempOptMax),
                dates: datesToISOArray(rowDates),
                fenologicId: selectedFenologicId,
                fenologicValues: rowValues,
            };

            console.log('Enviando datos al backend:', analyticData);

            // Enviar al backend
            await onPost(analyticData);

            console.log('Datos guardados exitosamente');

            // Actualizar contador de semanas para esta fenología específica
            setWeeksPerFenologic(prev => ({
                ...prev,
                [selectedFenologicId]: (prev[selectedFenologicId] || 0) + weekCount
            }));

            // Resetear formulario a Step 2
            setSelectedFenologicId('');
            setWeekCount(0);
            setRowDates([]);
            setRowValues([]);
            setCurrentStep('select');
        } catch (error) {
            console.error('Error al guardar:', error);
            alert(`Error al guardar los datos: ${error.message || error}`);
        }
    };

    // Volver a Step 1
    const handleBackToBasic = () => {
        setCurrentStep('basic');
        setWeeksPerFenologic({});
    };

    // Volver a Step 2
    const handleBackToSelect = () => {
        setCurrentStep('select');
        setSelectedFenologicId('');
        setWeekCount(0);
    };

    // Volver a Step 3
    const handleBackToCount = () => {
        setCurrentStep('count');
        setRowDates([]);
        setRowValues([]);
    };

    const selectedFenologic = fenologics.find(f => f.id === selectedFenologicId);

    return (
        <div className="analytic-form-container">
            <h2>Crear Análisis</h2>

            {showSuccess && (
                <div className="success-message">
                    Datos guardados correctamente
                </div>
            )}

            {/* STEP 1: Basic Information */}
            {currentStep === 'basic' && (
                <>
                    <div className="form-group">
                        <label htmlFor="dateAnalytic">Fecha del Análisis</label>
                        <input
                            id="dateAnalytic"
                            type="date"
                            value={step1Data.dateAnalytic}
                            onChange={(e) => setStep1Data({ ...step1Data, dateAnalytic: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="stationId">Estación</label>
                        <select
                            name="stationId"
                            id="stationId"
                            required
                            value={selectedStationId}
                            onChange={(e) => {
                                setSelectedStationId(e.target.value);
                                setSelectedCultiveId('');
                            }}
                        >
                            <option value="">Selecciona una estación</option>
                            {stations.map(station => (
                                <option key={station.id} value={station.id}>
                                    {station.nameStation}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedStationId && (
                        <div className="form-group">
                            <label htmlFor="cultiveId">Cultivo</label>
                            <select
                                id="cultiveId"
                                required
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

                    {selectedCultiveId && (
                        <>
                            <div className="form-group">
                                <label htmlFor="tempOptMin">Temp. Óptima Mínima (°C)</label>
                                <input
                                    id="tempOptMin"
                                    type="number"
                                    step="0.1"
                                    value={step1Data.tempOptMin}
                                    onChange={(e) => setStep1Data({ ...step1Data, tempOptMin: e.target.value })}
                                    placeholder="Ej: 20.0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="tempOptMax">Temp. Óptima Máxima (°C)</label>
                                <input
                                    id="tempOptMax"
                                    type="number"
                                    step="0.1"
                                    value={step1Data.tempOptMax}
                                    onChange={(e) => setStep1Data({ ...step1Data, tempOptMax: e.target.value })}
                                    placeholder="Ej: 30.0"
                                    required
                                />
                            </div>

                            <button type="button" onClick={handleNext} className="next-button">
                                Agregar valores fenológicos
                            </button>
                        </>
                    )}
                </>
            )}

            {/* STEP 2: Select Phenological Value */}
            {currentStep === 'select' && (
                <div className="fenologic-selection">
                    <button type="button" onClick={handleBackToBasic} className="back-button">
                        ← Volver a información básica
                    </button>

                    <div className="progress-info">
                        <h3>Selecciona un valor fenológico</h3>
                        <p>Cada fenología tiene hasta 10 semanas disponibles</p>
                        {Object.keys(weeksPerFenologic).length > 0 && (
                            <div style={{ marginTop: '10px', fontSize: '14px' }}>
                                {filteredFenologics.map(f => {
                                    const used = weeksPerFenologic[f.id] || 0;
                                    if (used > 0) {
                                        return <div key={f.id}><strong>{f.abbreviation}:</strong> {used}/10 semanas</div>;
                                    }
                                    return null;
                                })}
                            </div>
                        )}
                    </div>

                    <div className="fenologic-cards">
                        {filteredFenologics.map(fenologic => {
                            const weeksUsed = weeksPerFenologic[fenologic.id] || 0;
                            const isDisabled = weeksUsed >= MAX_WEEKS;

                            return (
                                <button
                                    key={fenologic.id}
                                    type="button"
                                    className="fenologic-card"
                                    onClick={() => handleSelectFenologic(fenologic.id)}
                                    disabled={isDisabled}
                                >
                                    <div className="fenologic-abbr">{fenologic.abbreviation}</div>
                                    <div className="fenologic-name">{fenologic.nameFenologic}</div>
                                    <div style={{ fontSize: '12px', marginTop: '8px', color: '#7f8c8d' }}>
                                        {weeksUsed}/10 semanas
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {Object.keys(weeksPerFenologic).length > 0 && (
                        <button type="button" className="finish-button" onClick={() => window.location.href = '/chart'}>
                            Finalizar y Ver Gráfico
                        </button>
                    )}
                </div>
            )}

            {/* STEP 3: Choose Week Count */}
            {currentStep === 'count' && (
                <div className="week-count-selection">
                    <button type="button" onClick={handleBackToSelect} className="back-button">
                        ← Volver a selección
                    </button>

                    <h3>¿Cuántas semanas quieres llenar para {selectedFenologic?.abbreviation}?</h3>
                    <p>Tienes {MAX_WEEKS - (weeksPerFenologic[selectedFenologicId] || 0)} semanas disponibles para esta fenología</p>

                    <div className="form-group">
                        <input
                            type="number"
                            min="1"
                            max={MAX_WEEKS - (weeksPerFenologic[selectedFenologicId] || 0)}
                            value={weekCount || ''}
                            onChange={(e) => setWeekCount(parseInt(e.target.value) || 0)}
                            placeholder="Número de semanas"
                            className="week-count-input"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSetWeekCount}
                        className="next-button"
                        disabled={weekCount < 1 || weekCount > (MAX_WEEKS - (weeksPerFenologic[selectedFenologicId] || 0))}
                    >
                        Continuar
                    </button>
                </div>
            )}

            {/* STEP 4: Data Entry Grid */}
            {currentStep === 'entry' && (
                <div className="data-entry-grid">
                    <button type="button" onClick={handleBackToCount} className="back-button">
                        ← Volver
                    </button>

                    <h3>Ingresa los valores para {selectedFenologic?.abbreviation}</h3>
                    <p className="instruction">Cada semana tiene 10 valores. Los valores en 0 no se contarán en el gráfico.</p>

                    <div className="grid-container">
                        {/* Header */}
                        <div className="grid-header">
                            <div className="grid-cell">#</div>
                            <div className="grid-cell">Fecha</div>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                <div key={i} className="grid-cell">V{i}</div>
                            ))}
                        </div>

                        {/* Data Rows */}
                        {Array.from({ length: weekCount }).map((_, weekIndex) => (
                            <div key={weekIndex} className="grid-row">
                                <div className="grid-cell row-number">{weekIndex + 1}</div>

                                {/* Date Input */}
                                <div className="grid-cell">
                                    <input
                                        type="date"
                                        value={rowDates[weekIndex] || ''}
                                        onChange={(e) => handleDateChange(weekIndex, e.target.value)}
                                        required
                                        className="date-input"
                                    />
                                </div>

                                {/* 10 Value Inputs */}
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(valueIndex => (
                                    <div key={valueIndex} className="grid-cell">
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={rowValues[weekIndex]?.[valueIndex] || 0}
                                            onChange={(e) => handleValueChange(weekIndex, valueIndex, e.target.value)}
                                            className="value-input"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={handleSaveAndContinue} className="save-button">
                        Guardar y Continuar
                    </button>
                </div>
            )}
        </div>
    );
};