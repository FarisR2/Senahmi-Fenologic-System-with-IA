import { Link } from "react-router-dom";
import { CultiveForm } from "../../components/Forms/CultiveForm/CultiveForm";
import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";
import { API_CONFIG } from "../../config/api.config";

interface Station {
    id: number;
    nameStation: string;
}

const CreateCultivePage = () => {
    const { data: stations } = useGet<Station[]>(API_CONFIG.ENDPOINTS.STATION);
    const { post, showSuccess, error } = usePost(`${API_CONFIG.ENDPOINTS.CULTIVE}/create-cultive`);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const rawData = Object.fromEntries(formData);
        const data = {
            ...rawData,
            stationId: parseInt(rawData.stationId as string, 10),
            dayInterval: parseInt(rawData.dayInterval as string, 10)
        };
        post(data);
    };

    return (
        <>
            <CultiveForm handleSubmit={handleSubmit} showSuccess={showSuccess} stations={stations || []} error={error} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/fenologic">
                    <button className="next-step-btn">Siguiente paso</button>
                </Link>
            </div>
        </>
    );
};

export default CreateCultivePage;
