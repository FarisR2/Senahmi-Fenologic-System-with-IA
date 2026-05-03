import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './ActivityFeed.css';

export interface ActivityItem {
    id: string;
    status: 'COMPLETADO' | 'PROCESAMIENTO ACTIVO' | 'PROGRAMADO';
    timeText: string;
    title: string;
    description: string;
    progress?: number;
    icon: ReactNode;
    statusColor: 'green' | 'blue' | 'gray';
}

interface ActivityFeedProps {
    activities: ActivityItem[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
    return (
        <div className="activity-feed-section">
            <div className="activity-feed-header">
                <h2>Actividad Reciente</h2>
                <p>Operaciones del sistema y actualizaciones fenológicas.</p>
            </div>
            
            <div className="activity-timeline">
                {activities.map((activity, index) => (
                    <div className="timeline-item" key={activity.id}>
                        <div className="timeline-indicator-container">
                            <div className={`timeline-dot bg-${activity.statusColor}`}>
                                {activity.icon}
                            </div>
                            {index !== activities.length - 1 && <div className="timeline-line"></div>}
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-meta">
                                <span className={`status-text text-${activity.statusColor}`}>
                                    {activity.status} {activity.timeText && `HACE ${activity.timeText}`}
                                </span>
                            </div>
                            <h4 className="timeline-title">{activity.title}</h4>
                            <p className="timeline-description">{activity.description}</p>
                            
                            {activity.progress !== undefined && (
                                <div className="timeline-progress">
                                    <div className="progress-header">
                                        <span>Progreso de Semana Fenológica</span>
                                        <span>{activity.progress}%</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div 
                                            className="progress-bar-fill" 
                                            style={{ width: `${activity.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="create-new-card">
                <div className="create-new-icon">+</div>
                <div className="create-new-content">
                    <h4>Crear Nuevo Registro</h4>
                    <p>Ingreso manual de observaciones de campo y anomalías fenológicas.</p>
                </div>
                <Link to="/fenologic" className="create-new-link">↗</Link>
            </div>
        </div>
    );
};