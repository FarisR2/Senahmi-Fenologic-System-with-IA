import './CultiveForm.css';

interface Station {
    id: string;
    nameStation: string;
}

interface Props {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    showSuccess: boolean;
    stations: Station[];
    error?: string | null;
}

export const CultiveForm = ({ handleSubmit, showSuccess, stations, error }: Props) => {
    return (
        <div className="cultive-form-container">
            <form onSubmit={handleSubmit}>
                <h2>Crear Cultivo</h2>

                {showSuccess && (
                    <div className="success-message">
                        ✅ Cultivo creado correctamente.
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                {stations.length === 0 && (
                    <div className="error-message">
                        No hay estaciones disponibles
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="stationId">Estación</label>
                    <select name="stationId" id="stationId" required>
                        <option value="">Selecciona una estación</option>
                        {stations.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.nameStation}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="nameCultive">Nombre del Cultivo</label>
                    <input
                        id="nameCultive"
                        type="text"
                        name="nameCultive"
                        placeholder="Ej: Cacao, Papa, Maíz..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="dayInterval">Intervalo de Días para Mediciones</label>
                    <input
                        id="dayInterval"
                        type="number"
                        name="dayInterval"
                        min="1"
                        max="30"
                        defaultValue="7"
                        placeholder="Ej: 7"
                        required
                    />
                    <small style={{ color: '#666', fontSize: '0.85em' }}>
                        Días entre cada medición fenológica (1-30)
                    </small>
                </div>

                <button type="submit">Enviar Datos</button>
            </form>
        </div>
    )
}