import './HeatMap.css';

export const HeatMap = () => {
    return (
        <div className="heatmap-container">
            <div className="heatmap-legend">
                <span className="legend-title">MAPA DE CALOR DE RIESGOS</span>
                <div className="legend-items">
                    <span className="legend-item"><span className="dot dot-green"></span> Óptimo</span>
                    <span className="legend-item"><span className="dot dot-yellow"></span> Precaución</span>
                    <span className="legend-item"><span className="dot dot-red"></span> Crítico</span>
                </div>
            </div>
            {/* IDESEP iframe integration. For now, an image or styled background. */}
            {/* In a real implementation we would use the actual iframe URL provided by IDESEP */}
            <div className="heatmap-visual">
                <iframe 
                    title="IDESEP SENAMHI Map"
                    src="https://idesep.senamhi.gob.pe/" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }}
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
};