import { useGet } from "../../hooks/useGet";
import { usePost } from "../../hooks/usePost";
import { AnalyticForm } from "../../components/Forms/AnalyticForm/AnalyticForm";
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

interface Fenologic {
    id: number;
    nameFenologic: string;
    abbreviation: string;
    cultiveId: number;
}

const CreateAnalyticPage = () => {
    const { data: stations } = useGet<Station[]>(API_CONFIG.ENDPOINTS.STATION);
    const { data: cultives } = useGet<Cultive[]>(API_CONFIG.ENDPOINTS.CULTIVE);
    const { data: fenologics } = useGet<Fenologic[]>(API_CONFIG.ENDPOINTS.FENOLOGIC);
    const { post, showSuccess } = usePost(`${API_CONFIG.ENDPOINTS.ANALYTIC}/create-analytic`);

    return (
        <>
            <AnalyticForm
                onPost={post}
                showSuccess={showSuccess}
                stations={stations || []}
                cultives={cultives || []}
                fenologics={fenologics || []}
            />

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/chart">
                    <button className="next-step-btn">Ver Gráfico de Análisis</button>
                </Link>
            </div>
        </>
    );
};

export default CreateAnalyticPage;
