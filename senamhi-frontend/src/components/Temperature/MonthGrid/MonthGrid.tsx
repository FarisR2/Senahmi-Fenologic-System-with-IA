import MonthUploadCard from '../MonthUploadCard/MonthUploadCard';
import './MonthGrid.css';

interface MonthGridProps {
    year: number;
    stationId: string;
    uploadedMonths: Set<number>;
    uploadedFiles: Record<number, string>;
    onUploadSuccess: () => void;
    onUpload: (month: number, year: number, data: any) => Promise<void>;
}

const MonthGrid = ({
    year,
    stationId,
    uploadedMonths,
    uploadedFiles,
    onUploadSuccess,
    onUpload
}: MonthGridProps) => {
    const leftMonths = [1, 2, 3, 4, 5, 6];
    const rightMonths = [7, 8, 9, 10, 11, 12];

    return (
        <div className="month-grid">
            <div className="month-column">
                {leftMonths.map((month) => (
                    <MonthUploadCard
                        key={month}
                        month={month}
                        year={year}
                        stationId={stationId}
                        isUploaded={uploadedMonths.has(month)}
                        fileName={uploadedFiles[month]}
                        onUploadSuccess={onUploadSuccess}
                        onUpload={onUpload}
                    />
                ))}
            </div>
            <div className="month-column">
                {rightMonths.map((month) => (
                    <MonthUploadCard
                        key={month}
                        month={month}
                        year={year}
                        stationId={stationId}
                        isUploaded={uploadedMonths.has(month)}
                        fileName={uploadedFiles[month]}
                        onUploadSuccess={onUploadSuccess}
                        onUpload={onUpload}
                    />
                ))}
            </div>
        </div>
    );
};

export default MonthGrid;
