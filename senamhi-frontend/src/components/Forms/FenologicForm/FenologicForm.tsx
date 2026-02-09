import './FenologicForm.css';

interface Station {
    id: string;
    nameStation: string;
}

interface Cultive {
    id: string;
    nameCultive: string;
    stationId: string;
}

interface Props {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    showSuccess: boolean;
    stations: Station[];
    cultives: Cultive[];
    selectedStationId: string;
    onStationChange: (stationId: string) => void;
}

export const FenologicForm = ({
    handleSubmit,
    showSuccess,
    stations,
    cultives,
    selectedStationId,
    onStationChange
}: Props) => {
    // Filtrar cultivos por estación seleccionada
    const filteredCultives = selectedStationId
        ? cultives.filter(c => c.stationId === selectedStationId)
        : [];

    return (
        <div className="fenologic-form-container">
            <form onSubmit={handleSubmit}>
                <h2>Crear nueva fenologia</h2>

                {showSuccess && (
                    <div className="success-message">
                        <p>Los datos fueron enviados</p>
                    </div>
                )}

                {stations.length === 0 && (
                    <div className="error-message">
                        <p>No hay estaciones disponibles</p>
                    </div>
                )}

                {/* Selector de Estación */}
                <div className="form-group">
                    <label htmlFor="stationId">Estación</label>
                    <select
                        id="stationId"
                        value={selectedStationId}
                        onChange={(e) => onStationChange(e.target.value)}
                        required
                    >
                        <option value="">Selecciona una estación</option>
                        {stations.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.nameStation}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selector de Cultivo (filtrado por estación) */}
                <div className="form-group">
                    <label htmlFor="cultiveId">Cultivo</label>
                    <select name="cultiveId" id="cultiveId" required disabled={!selectedStationId}>
                        <option value="">
                            {selectedStationId ? 'Selecciona un cultivo' : 'Primero selecciona una estación'}
                        </option>
                        {filteredCultives.map(cultive => (
                            <option key={cultive.id} value={cultive.id}>
                                {cultive.nameCultive}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedStationId && filteredCultives.length === 0 && (
                    <div className="info-message">
                        <p>No hay cultivos disponibles para esta estación</p>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="nameFenologic">Nombre de la fenologia</label>
                    <input
                        id="nameFenologic" required
                        type="text"
                        name="nameFenologic"
                        placeholder="Floración, fructificación, etc"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="abbreviation">Abreviatura</label>
                    <input
                        id="abbreviation" required
                        type="text"
                        name="abbreviation"
                        placeholder="FL, FR, etc"
                    />
                </div>
                <button type="submit">Enviar fenologia</button>
            </form>
        </div>
    )
}