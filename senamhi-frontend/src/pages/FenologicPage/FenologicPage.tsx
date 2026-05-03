import { useState } from "react";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";
import { FenologicForm } from "../../components/Forms/FenologicForm/FenologicForm";
import { Link } from "react-router-dom";
import { API_CONFIG } from "../../config/api.config";

interface Station {
    id: number;
    nameStation: string;
}

interface Cultive {
    id: number;
    nameCultive: string;
    stationId: number;
}

const CreateFenologicPage = () => {
    const [selectedStationId, setSelectedStationId] = useState<number | string>('');

    const { data: stations } = useGet<Station[]>(API_CONFIG.ENDPOINTS.STATION);
    const { data: cultives } = useGet<Cultive[]>(API_CONFIG.ENDPOINTS.CULTIVE);
    const { post, showSuccess, error } = usePost(`${API_CONFIG.ENDPOINTS.FENOLOGIC}/create-fenologic`);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const rawData = Object.fromEntries(formData);
        const data = {
            ...rawData,
            cultiveId: parseInt(rawData.cultiveId as string, 10)
        };
        post(data);
    };

    return (
        <>
            <FenologicForm
                handleSubmit={handleSubmit}
                showSuccess={showSuccess}
                stations={stations || []}
                cultives={cultives || []}
                selectedStationId={selectedStationId}
                onStationChange={setSelectedStationId}
                error={error}
            />

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/temperature">
                    <button className="next-step-btn">Siguiente paso: Cargar Temperaturas</button>
                </Link>
            </div>
        </>
    );
};

export default CreateFenologicPage;
