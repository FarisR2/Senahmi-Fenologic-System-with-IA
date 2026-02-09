import { FaBars } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './Dashboard.css';

interface NavbarProps {
    onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const location = useLocation();

    // Mapeo de rutas a títulos
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
                {/* Botón menú móvil */}
                <button
                    className="navbar-menu-btn"
                    onClick={onToggleSidebar}
                    aria-label="Toggle menu"
                >
                    <FaBars />
                </button>

                {/* Título de página */}
                <h2 className="navbar-title">{currentTitle}</h2>

                {/* Espacio para futuras acciones (usuario, notificaciones, etc.) */}
                <div className="navbar-actions">
                    {/* Placeholder para futuras funcionalidades */}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
