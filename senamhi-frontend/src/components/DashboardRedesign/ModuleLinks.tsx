import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import './ModuleLinks.css';

interface ModuleLinkProps {
    title: string;
    description: string;
    icon: ReactNode;
    path: string;
    iconBgColor: string;
}

interface ModuleLinksProps {
    links: ModuleLinkProps[];
}

export const ModuleLinks = ({ links }: ModuleLinksProps) => {
    return (
        <div className="module-links-section">
            <div className="module-links-header">
                <div>
                    <h2>Módulos Estratégicos</h2>
                    <p>Acceso directo a los grupos de datos observacionales básicos.</p>
                </div>
                <span className="arrow-icon">→</span>
            </div>
            
            <div className="module-grid">
                {links.map((link) => (
                    <Link to={link.path} key={link.path} className="module-card">
                        <div 
                            className="module-icon-container" 
                            style={{ backgroundColor: link.iconBgColor }}
                        >
                            {link.icon}
                        </div>
                        <h3 className="module-title">{link.title}</h3>
                        <p className="module-description">{link.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};