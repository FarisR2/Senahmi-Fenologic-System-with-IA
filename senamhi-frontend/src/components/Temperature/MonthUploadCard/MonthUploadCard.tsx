import { useState } from 'react';
import * as XLSX from 'xlsx';
import { FaUpload, FaCheckCircle, FaFileExcel } from 'react-icons/fa';
import './MonthUploadCard.css';

interface MonthUploadCardProps {
    month: number;
    year: number;
    stationId: string;
    isUploaded: boolean;
    fileName?: string;
    onUploadSuccess: () => void;
    onUpload: (month: number, year: number, data: any) => Promise<void>;
}

const MONTH_NAMES = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

const MonthUploadCard = ({
    month,
    year,
    stationId,
    isUploaded,
    fileName,
    onUploadSuccess,
    onUpload
}: MonthUploadCardProps) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !stationId) {
            alert('Por favor selecciona una estación primero');
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
                await onUpload(month, year, jsonData);
                onUploadSuccess();
            } catch (err) {
                console.error('Error al procesar Excel:', err);
                alert('Error al procesar el archivo Excel');
            } finally {
                setUploading(false);
                e.target.value = '';
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className={`month-upload-card ${isUploaded ? 'uploaded' : ''}`}>
            <div className="month-header">
                <h3 className="month-name">{MONTH_NAMES[month - 1]}</h3>
                {isUploaded && <FaCheckCircle className="upload-status-icon" />}
            </div>

            <div className="month-body">
                {isUploaded ? (
                    <div className="uploaded-info">
                        <FaFileExcel className="file-icon" />
                        <span className="upload-status-text">Archivo cargado</span>
                        {fileName && <small className="file-name">{fileName}</small>}
                    </div>
                ) : (
                    <label className="upload-button">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            disabled={uploading || !stationId}
                            className="file-input"
                        />
                        <FaUpload className="upload-icon" />
                        <span>{uploading ? 'Cargando...' : 'Cargar Archivo'}</span>
                    </label>
                )}
            </div>

            {isUploaded && <div className="month-actions"></div>}
        </div>
    );
};

export default MonthUploadCard;
