import { useGet } from '../../hooks/useGet';
import { HeroBanner } from '../../components/DashboardRedesign/HeroBanner';
import { StatCard } from '../../components/DashboardRedesign/StatCard';
import { ModuleLinks } from '../../components/DashboardRedesign/ModuleLinks';
import { ActivityFeed } from '../../components/DashboardRedesign/ActivityFeed';
import type { ActivityItem } from '../../components/DashboardRedesign/ActivityFeed';
import { HeatMap } from '../../components/DashboardRedesign/HeatMap';
import { timeAgo } from '../../utils/dateUtils';

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

// Interfaz para la entidad de backend
interface BackendActivityLog {
    id: number;
    entityType: string;
    entityId: number | null;
    actionType: string;
    status: string;
    title: string;
    description: string;
    progress: number | null;
    createdAt: string;
}

const DashboardHome = () => {
    // Container Logic: Fetching data from backend endpoints
    const { data: stats, loading: loadingStats, error: errorStats } = useGet<DashboardStats>('/dashboard/stats');
    const { data: logs, loading: loadingLogs, error: errorLogs } = useGet<BackendActivityLog[]>('/activity-logs/recent?limit=4');

    // Static/Mocked data for Module Links
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

    // Mapeo dinámico de logs del backend hacia el formato del componente visual
    const mapLogToActivityItem = (log: BackendActivityLog): ActivityItem => {
        let icon = <FaCheckCircle />;
        let statusColor: 'green' | 'blue' | 'gray' = 'gray';
        let statusMap: ActivityItem['status'] = 'COMPLETADO';

        if (log.actionType === 'COMPLETED' || log.status === 'COMPLETADO') {
            icon = <FaCheckCircle />;
            statusColor = 'green';
            statusMap = 'COMPLETADO';
        } else if (log.actionType === 'PROCESSING' || log.status === 'PROCESAMIENTO ACTIVO') {
            icon = <FaSync className="fa-spin" />;
            statusColor = 'blue';
            statusMap = 'PROCESAMIENTO ACTIVO';
        } else if (log.actionType === 'SCHEDULED' || log.status === 'PROGRAMADO') {
            icon = <FaClock />;
            statusColor = 'gray';
            statusMap = 'PROGRAMADO';
        }

        return {
            id: log.id.toString(),
            status: statusMap,
            timeText: timeAgo(log.createdAt),
            title: log.title,
            description: log.description,
            progress: log.progress !== null ? log.progress : undefined,
            icon,
            statusColor
        };
    };

    const recentActivities: ActivityItem[] = logs ? logs.map(mapLogToActivityItem) : [];

    if (loadingStats || loadingLogs) {
        return <div className="dashboard-loading">Cargando inteligencia agroclimática...</div>;
    }

    if (errorStats || errorLogs) {
        return <div className="dashboard-error">Error al cargar datos: {errorStats || errorLogs}</div>;
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