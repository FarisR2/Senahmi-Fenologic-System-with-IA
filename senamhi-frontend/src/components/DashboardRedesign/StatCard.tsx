import { ReactNode } from 'react';
import './StatCard.css';

interface StatCardProps {
    icon: ReactNode;
    count: number | string;
    label: string;
    tag?: string;
    tagColor?: 'green' | 'blue' | 'red';
    statusText: string;
    borderColor?: string;
}

export const StatCard = ({
    icon,
    count,
    label,
    tag,
    tagColor = 'green',
    statusText,
    borderColor = '#e2e8f0'
}: StatCardProps) => {
    return (
        <div className="stat-card" style={{ borderLeftColor: borderColor }}>
            <div className="stat-card-header">
                <div className="stat-icon" style={{ color: borderColor }}>
                    {icon}
                </div>
                {tag && (
                    <span className={`stat-tag stat-tag-${tagColor}`}>
                        {tag}
                    </span>
                )}
            </div>
            <div className="stat-card-body">
                <p className="stat-label">{label}</p>
                <h2 className="stat-count">{count}</h2>
            </div>
            <div className="stat-card-footer">
                <p className="stat-status">{statusText}</p>
            </div>
        </div>
    );
};