import './StationForm.css';

interface Props {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    showSuccess: boolean;
    error?: string | null;
}

export const StationForm = ({ handleSubmit, showSuccess, error }: Props) => {
    return (
        <div className="station-form-container">
            <form onSubmit={handleSubmit}>
                <h2>Crear Estación</h2>

                {showSuccess && (
                    <div className="success-message">
                        ✅ Estación creada correctamente.
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="nameStation">Nombre de la Estación</label>
                    <input
                        id="nameStation"
                        name="nameStation"
                        type="text"
                        placeholder="Ej: CO-Aucayacu, CO-Chaglla"
                        required
                    />
                </div>
                <button type="submit">Enviar Datos</button>
            </form>
        </div>
    );
};