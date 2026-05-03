import { useGet } from '../../hooks/useGet';
import { HeroBanner } from '../../components/DashboardRedesign/HeroBanner';
import { StatCard } from '../../components/DashboardRedesign/StatCard';
import { ModuleLinks } from '../../components/DashboardRedesign/ModuleLinks';
import { ActivityFeed } from '../../components/DashboardRedesign/ActivityFeed';
import type { ActivityItem } from '../../components/DashboardRedesign/ActivityFeed';
import { HeatMap } from '../../components/DashboardRedesign/HeatMap';

import { 
    FaMapMarkerAlt, 
    FaSeedling, 
    FaLeaf,
    FaCheckCircle,
    FaSync,
    FaClock
} from 'react-icons/fa';

import './DashboardHome.css';

interface DashboardStats {
    stations: { count: number; label: string; trend: string; statusText: string };
    cultives: { count: number; label: string; tag: string; statusText: string };
    fenologics: { count: number; label: string; tag: string; statusText: string };
}

const DashboardHome = () => {
    // Container Logic: Fetching data from the new backend endpoint
    const { data: stats, loading, error } = useGet<DashboardStats>('/dashboard/stats');

    // Static/Mocked data for Module Links (these just navigate to other views)
    const moduleLinks = [
        {
            title: 'Estaciones',
            description: 'Gestión de red geoespacial y diagnóstico de salud de estaciones.',
            icon: <FaMapMarkerAlt />,
            path: '/station',
            iconBgColor: '#1e3a8a'
        },
        {
            title: 'Cultivos',
            description: 'Censo agrícola y umbrales climáticos específicos por cultivo.',
            icon: <FaSeedling />,
            path: '/cultive',
            iconBgColor: '#16a34a'
        },
        {
            title: 'Fenologías',
            description: 'Seguimiento de etapas desde germinación hasta cosecha.',
            icon: <FaLeaf />,
            path: '/fenologic',
            iconBgColor: '#9a3412'
        }
    ];

    // Static/Mocked data for Activity Feed since the backend endpoint for this doesn't exist yet
    const recentActivities: ActivityItem[] = [
        {
            id: '1',
            status: 'COMPLETADO',
            timeText: '10M',
            title: 'Fenología: Floración de Cultivo: Papa',
            description: 'Se detectó el inicio masivo de floración en el clúster de Huancayo.',
            icon: <FaCheckCircle />,
            statusColor: 'green'
        },
        {
            id: '2',
            status: 'PROCESAMIENTO ACTIVO',
            timeText: '',
            title: 'Fenología: Maduración de Cultivo: Maíz',
            description: 'Análisis de coloración de grano en el valle del Mantaro.',
            progress: 80,
            icon: <FaSync className="fa-spin" />,
            statusColor: 'blue'
        },
        {
            id: '3',
            status: 'PROGRAMADO',
            timeText: 'LAS 16:00',
            title: 'Fenología: Siembra de Cultivo: Arroz',
            description: 'Preparación del ciclo de monitoreo para la campaña norte.',
            icon: <FaClock />,
            statusColor: 'gray'
        }
    ];

    if (loading) {
        return <div className="dashboard-loading">Cargando inteligencia agroclimática...</div>;
    }

    if (error) {
        return <div className="dashboard-error">Error al cargar datos: {error}</div>;
    }

    return (
        <div className="dashboard-redesign-container">
            <div className="dashboard-main-content">
                <HeroBanner 
                    title="Monitor Nacional de Inteligencia Agroclimática"
                    subtitle="Monitoreo de precisión en 24 regiones. La estabilidad atmosférica actual favorece el rendimiento de papa y maíz en la sierra central."
                />
                
                <div className="dashboard-stats-grid">
                    <StatCard 
                        icon={<FaMapMarkerAlt />}
                        count={stats?.stations.count ?? 0}
                        label={stats?.stations.label ?? "ESTACIONES"}
                        tag={stats?.stations.trend}
                        tagColor="green"
                        statusText={stats?.stations.statusText ?? "Estado desconocido"}
                        borderColor="#3b82f6"
                    />
                    <StatCard 
                        icon={<FaSeedling />}
                        count={stats?.cultives.count ?? 0}
                        label={stats?.cultives.label ?? "CULTIVOS"}
                        tag={stats?.cultives.tag}
                        tagColor="blue"
                        statusText={stats?.cultives.statusText ?? "Estado desconocido"}
                        borderColor="#10b981"
                    />
                    <StatCard 
                        icon={<FaLeaf />}
                        count={stats?.fenologics.count ?? 0}
                        label={stats?.fenologics.label ?? "FENOLOGÍAS"}
                        tag={stats?.fenologics.tag}
                        tagColor="red"
                        statusText={stats?.fenologics.statusText ?? "Estado desconocido"}
                        borderColor="#8b5cf6"
                    />
                </div>

                <ModuleLinks links={moduleLinks} />

                <HeatMap />
            </div>

            <div className="dashboard-sidebar-content">
                <ActivityFeed activities={recentActivities} />
            </div>
        </div>
    );
};

export default DashboardHome;