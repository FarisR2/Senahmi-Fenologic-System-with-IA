import { Link } from "react-router-dom";
import { CultiveForm } from "../components/Forms/CultiveForm/CultiveForm";
import { useGet } from "../hooks/useGet";
import { usePost } from "../hooks/usePost";

interface Station {
    id: string;
    nameStation: string;
}

const CreateCultivePage = () => {
    const { data: stations } = useGet<Station[]>("http://localhost:3000/station")
    const { post, showSuccess } = usePost("http://localhost:3000/cultive/create-cultive")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const rawData = Object.fromEntries(formData);

        // Convertir dayInterval a número
        const data = {
            ...rawData,
            dayInterval: parseInt(rawData.dayInterval as string, 10)
        };

        console.log('Datos a enviar:', data);
        console.log('Tipo de dayInterval:', typeof data.dayInterval);

        post(data);
    }

    return (
        <>
            <CultiveForm handleSubmit={handleSubmit} showSuccess={showSuccess} stations={stations || []} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/fenologic">
                    <button className="next-step-btn">Siguiente paso</button>
                </Link>
            </div>
        </>
    )
}

export default CreateCultivePage