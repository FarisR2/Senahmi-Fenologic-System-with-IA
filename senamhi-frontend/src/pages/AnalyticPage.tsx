import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { AnalyticForm } from "../components/Forms/AnalyticForm/AnalyticForm";
import { Link } from "react-router-dom";
import '../App.css';

interface Station {
    id: string;
    nameStation: string;
}

interface Cultive {
    id: string;
    nameCultive: string;
    stationId: string;
}

interface Fenologic {
    id: string;
    nameFenologic: string;
    abbreviation: string;
    cultiveId: string;
}

const CreateAnalyticPage = () => {
    const { data: stations } = useGet<Station[]>("http://localhost:3000/station");
    const { data: cultives } = useGet<Cultive[]>("http://localhost:3000/cultive");
    const { data: fenologics } = useGet<Fenologic[]>("http://localhost:3000/fenologic");
    const { post, showSuccess } = usePost("http://localhost:3000/analytic/create-analytic");

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
