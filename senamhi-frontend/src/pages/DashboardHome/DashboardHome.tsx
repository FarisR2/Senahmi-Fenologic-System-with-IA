import { Link } from 'react-router-dom';
import {
    FaMapMarkerAlt,
    FaSeedling,
    FaLeaf,
    FaThermometerHalf,
    FaChartBar,
    FaChartLine
} from 'react-icons/fa';
import './DashboardHome.css';

const DashboardHome = () => {
    const quickLinks = [
        {
            title: 'Estaciones',
            description: 'Gestionar estaciones meteorológicas',
            icon: FaMapMarkerAlt,
            path: '/station',
            color: '#3b82f6',
        },
        {
            title: 'Cultivos',
            description: 'Administrar tipos de cultivos',
            icon: FaSeedling,
            path: '/cultive',
            color: '#10b981',
        },
        {
            title: 'Fenologías',
            description: 'Configurar etapas fenológicas',
            icon: FaLeaf,
            path: '/fenologic',
            color: '#8b5cf6',
        },
        {
            title: 'Temperaturas',
            description: 'Cargar datos de temperatura',
            icon: FaThermometerHalf,
            path: '/temperature',
            color: '#ef4444',
        },
        {
            title: 'Analíticos',
            description: 'Crear y gestionar analíticos',
            icon: FaChartBar,
            path: '/analytic',
            color: '#f59e0b',
        },
        {
            title: 'Gráficos',
            description: 'Visualizar datos y tendencias',
            icon: FaChartLine,
            path: '/chart',
            color: '#06b6d4',
        },
    ];

    return (
        <div className="dashboard-home">
            <div className="dashboard-home-header">
                <h1 className="dashboard-home-title">
                    Bienvenido al Sistema SENAMHI
                </h1>
                <p className="dashboard-home-subtitle">
                    Sistema de Análisis Agroclimático - Gestión integral de datos meteorológicos y fenológicos
                </p>
            </div>

            <div className="dashboard-home-grid">
                {quickLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className="dashboard-card"
                        style={{ '--card-color': link.color } as React.CSSProperties}
                    >
                        <div className="dashboard-card-icon">
                            <link.icon />
                        </div>
                        <div className="dashboard-card-content">
                            <h3 className="dashboard-card-title">{link.title}</h3>
                            <p className="dashboard-card-description">{link.description}</p>
                        </div>
                        <div className="dashboard-card-arrow">→</div>
                    </Link>
                ))}
            </div>

            <div className="dashboard-home-footer">
                <div className="dashboard-info-card">
                    <h3>📊 Inicio Rápido</h3>
                    <ol>
                        <li>Crea una <strong>Estación</strong> meteorológica</li>
                        <li>Define los <strong>Cultivos</strong> a analizar</li>
                        <li>Configura las <strong>Fenologías</strong> correspondientes</li>
                        <li>Carga los datos de <strong>Temperatura</strong></li>
                        <li>Crea <strong>Analíticos</strong> con fechas fenológicas</li>
                        <li>Visualiza los resultados en <strong>Gráficos</strong></li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
