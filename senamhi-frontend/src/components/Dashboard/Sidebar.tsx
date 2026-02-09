import { NavLink } from 'react-router-dom';
import {
    FaHome,
    FaMapMarkerAlt,
    FaSeedling,
    FaLeaf,
    FaThermometerHalf,
    FaChartBar,
    FaChartLine
} from 'react-icons/fa';
import './Dashboard.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const menuItems = [
        { path: '/', icon: FaHome, label: 'Dashboard', exact: true },
        { path: '/station', icon: FaMapMarkerAlt, label: 'Estaciones' },
        { path: '/cultive', icon: FaSeedling, label: 'Cultivos' },
        { path: '/fenologic', icon: FaLeaf, label: 'Fenologías' },
        { path: '/temperature', icon: FaThermometerHalf, label: 'Temperaturas' },
        { path: '/analytic', icon: FaChartBar, label: 'Analíticos' },
        { path: '/chart', icon: FaChartLine, label: 'Gráficos' },
    ];

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div className="sidebar-overlay" onClick={onClose}></div>
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                {/* Logo/Header */}
                <div className="sidebar-header">
                    <h1 className="sidebar-logo">
                        <FaChartLine className="sidebar-logo-icon" />
                        SENAMHI
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) =>
                                `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`
                            }
                            onClick={onClose}
                        >
                            <item.icon className="sidebar-nav-icon" />
                            <span className="sidebar-nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <p className="sidebar-footer-text">
                        Sistema de Análisis Agroclimático
                    </p>
                    <p className="sidebar-footer-version">v1.0.0</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
