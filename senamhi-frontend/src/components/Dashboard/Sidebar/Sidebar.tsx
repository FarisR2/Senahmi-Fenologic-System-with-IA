import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaMapMarkerAlt,
    FaSeedling,
    FaLeaf,
    FaThermometerHalf,
    FaChartBar,
    FaChartLine,
    FaSignOutAlt,
    FaTicketAlt,
    FaUsers
} from 'react-icons/fa';
import { useAuthStore } from '../../../store/authStore';
import { Role } from '../../../interfaces';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        onClose();
    };

    const isAdmin = user?.role === Role.ADMIN;

    const menuItems = [
        { path: '/', icon: FaHome, label: 'Dashboard', exact: true },
        { path: '/station', icon: FaMapMarkerAlt, label: 'Estaciones' },
        { path: '/cultive', icon: FaSeedling, label: 'Cultivos' },
        { path: '/fenologic', icon: FaLeaf, label: 'Fenologías' },
        { path: '/temperature', icon: FaThermometerHalf, label: 'Temperaturas' },
        { path: '/analytic', icon: FaChartBar, label: 'Analíticos' },
        { path: '/chart', icon: FaChartLine, label: 'Gráficos' },
    ];

    const adminItems = [
        { path: '/admin/tokens', icon: FaTicketAlt, label: 'Tokens' },
        { path: '/admin/users', icon: FaUsers, label: 'Usuarios' },
    ];

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <h1 className="sidebar-logo">
                        <FaChartLine className="sidebar-logo-icon" />
                        SENAMHI
                    </h1>
                </div>
                <nav className="sidebar-nav">
                    <p className="sidebar-section-title">MENÚ PRINCIPAL</p>
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

                    {isAdmin && (
                        <>
                            <p className="sidebar-section-title" style={{ marginTop: '20px' }}>ADMINISTRACIÓN</p>
                            {adminItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`
                                    }
                                    onClick={onClose}
                                >
                                    <item.icon className="sidebar-nav-icon" />
                                    <span className="sidebar-nav-label">{item.label}</span>
                                </NavLink>
                            ))}
                        </>
                    )}
                    
                    <button className="sidebar-nav-item logout-btn" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', marginTop: 'auto' }}>
                        <FaSignOutAlt className="sidebar-nav-icon" />
                        <span className="sidebar-nav-label">Cerrar Sesión</span>
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <p className="sidebar-footer-text">{user?.firstName} {user?.lastName}</p>
                    <p className="sidebar-footer-version">Rol: {user?.role?.toUpperCase()}</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
