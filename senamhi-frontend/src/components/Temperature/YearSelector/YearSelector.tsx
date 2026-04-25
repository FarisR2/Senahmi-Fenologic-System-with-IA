import './YearSelector.css';

interface YearSelectorProps {
    selectedYear: number;
    onYearChange: (year: number) => void;
    minYear?: number;
    maxYear?: number;
}

const YearSelector = ({
    selectedYear,
    onYearChange,
    minYear = 2014,
    maxYear = new Date().getFullYear()
}: YearSelectorProps) => {
    const years = Array.from(
        { length: maxYear - minYear + 1 },
        (_, i) => maxYear - i
    );

    return (
        <div className="year-selector-container">
            <label htmlFor="year-select" className="year-selector-label">
                Seleccionar Año:
            </label>
            <select
                id="year-select"
                className="year-selector"
                value={selectedYear}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
            >
                {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>
    );
};

export default YearSelector;
