import { StationForm } from "../components/Forms/StationForm/StationForm";
import { usePost } from "../hooks/usePost";
import { Link } from "react-router-dom";
import '../App.css';


const CreateStationPage = () => {
    const { post, showSuccess } = usePost('http://localhost:3000/station/create-station')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        post(data);
    };

    return (
        <>
            <StationForm handleSubmit={handleSubmit} showSuccess={showSuccess} />

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/cultive">
                    <button className="next-step-btn">Siguiente paso</button>
                </Link>
            </div>
        </>
    );
};

export default CreateStationPage;