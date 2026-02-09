import { useState } from "react";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";
import { FenologicForm } from "../components/Forms/FenologicForm/FenologicForm";
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

const CreateFenologicPage = () => {
    const [selectedStationId, setSelectedStationId] = useState<string>('');

    const { data: stations } = useGet<Station[]>("http://localhost:3000/station");
    const { data: cultives } = useGet<Cultive[]>("http://localhost:3000/cultive");
    const { post, showSuccess } = usePost("http://localhost:3000/fenologic/create-fenologic");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
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
            />

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/temperature">
                    <button className="next-step-btn">Siguiente paso: Cargar Temperaturas</button>
                </Link>
            </div>
        </>
    )
}

export default CreateFenologicPage