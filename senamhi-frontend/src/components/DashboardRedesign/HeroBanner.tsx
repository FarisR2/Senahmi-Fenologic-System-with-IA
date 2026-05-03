import './HeroBanner.css';

interface HeroBannerProps {
    title: string;
    subtitle: string;
}

export const HeroBanner = ({ title, subtitle }: HeroBannerProps) => {
    return (
        <div className="hero-banner">
            <div className="hero-banner-content">
                <span className="live-badge">SISTEMA EN VIVO</span>
                <h1 className="hero-title">{title}</h1>
                <p className="hero-subtitle">{subtitle}</p>
                <button className="hero-button">Descargar Boletín Semanal</button>
            </div>
        </div>
    );
};