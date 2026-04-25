import { FaBars } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
    onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const location = useLocation();

    const pageTitles: Record<string, string> = {
        '/': 'Dashboard',
        '/station': 'Gestión de Estaciones',
        '/cultive': 'Gestión de Cultivos',
        '/fenologic': 'Gestión de Fenologías',
        '/temperature': 'Carga de Temperaturas',
        '/analytic': 'Gestión de Analíticos',
        '/create-analytic': 'Crear Analítico',
        '/chart': 'Visualización de Gráficos',
    };

    const currentTitle = pageTitles[location.pathname] || 'SENAMHI';

    return (
        <header className="navbar">
            <div className="navbar-content">
                <button className="navbar-menu-btn" onClick={onToggleSidebar} aria-label="Toggle menu">
                    <FaBars />
                </button>
                <h2 className="navbar-title">{currentTitle}</h2>
                <div className="navbar-actions"></div>
            </div>
        </header>
    );
};

export default Navbar;
