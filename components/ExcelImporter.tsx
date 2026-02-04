'use client';

import { useState, useCallback } from 'react';
import { read, utils } from 'xlsx';
import { Upload, FileSpreadsheet, X, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists, if not I'll remove or create it. checked package.json -> clsx/tailwind-merge are there.

interface ExcelImporterProps {
    onImport: (data: Record<string, unknown>[]) => void;
    templateUrl?: string;
}

export default function ExcelImporter({ onImport, templateUrl }: ExcelImporterProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<Record<string, unknown>[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const processFile = useCallback((selectedFile: File) => {
        // Validate type
        if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
            setError('Formato no soportado. Por favor sube un archivo Excel (.xlsx, .xls) o CSV.');
            return;
        }

        setFile(selectedFile);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0]; // Assume first sheet
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: Record<string, unknown>[] = utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    setError('El archivo parece estar vacío.');
                    return;
                }

                setPreviewData(jsonData.slice(0, 5)); // Preview top 5 rows
                onImport(jsonData);
            } catch (err) {
                console.error('Error parsing excel:', err);
                setError('Error al leer el archivo. Asegúrate de que no esté dañado.');
            }
        };
        reader.readAsBinaryString(selectedFile);
    }, [onImport]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            processFile(files[0]);
        }
    }, [processFile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreviewData([]);
        setError(null);
        onImport([]); // Clear parent state
    };

    return (
        <div className="w-full">
            {!file ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                        isDragging ? "border-[var(--led-info)] bg-[var(--metal-800)]" : "border-[var(--metal-600)] hover:border-[var(--metal-400)] bg-[var(--metal-900)]",
                    )}
                >
                    <input
                        type="file"
                        className="hidden"
                        id="excel-upload"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleChange}
                    />
                    <label htmlFor="excel-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className={cn("w-12 h-12 mb-4", isDragging ? "text-[var(--led-info)]" : "text-[var(--metal-400)]")} />
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                            Arrastra tu archivo aquí o haz clic para subir
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                            Soporta .xlsx, .xls, .csv
                        </p>
                        {templateUrl && (
                            <a
                                href={templateUrl}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs text-[var(--ansi-blue)] hover:underline flex items-center gap-1"
                                download
                            >
                                <FileSpreadsheet className="w-3 h-3" />
                                Descargar plantilla de ejemplo
                            </a>
                        )}
                    </label>
                </div>
            ) : (
                <div className="bg-[var(--metal-800)] border border-[var(--metal-600)] rounded-lg overflow-hidden">
                    <div className="p-4 flex items-center justify-between border-b border-[var(--metal-600)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-[var(--ansi-green)]/10 flex items-center justify-center text-[var(--ansi-green)]">
                                <FileSpreadsheet className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-[var(--text-primary)]">{file.name}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="p-2 hover:bg-[var(--metal-700)] rounded-full text-[var(--text-secondary)] hover:text-[var(--ansi-red)] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error ? (
                        <div className="p-4 bg-[var(--ansi-red)]/5 text-[var(--ansi-red)] flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    ) : (
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3 text-sm text-[var(--ansi-green)]">
                                <Check className="w-4 h-4" />
                                <span className="font-medium">Archivo procesado correctamente. {previewData.length > 0 && "Vista previa:"}</span>
                            </div>

                            {previewData.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-[var(--metal-900)] text-[var(--text-secondary)]">
                                            <tr>
                                                {Object.keys(previewData[0]).map((header) => (
                                                    <th key={header} className="p-2 border-b border-[var(--metal-600)] font-normal uppercase tracking-wider">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, i) => (
                                                <tr key={i} className="border-b border-[var(--metal-700)] last:border-0 hover:bg-[var(--metal-700)]/50">
                                                    {Object.values(row).map((val: unknown, j) => (
                                                        <td key={j} className="p-2 text-[var(--text-primary)] whitespace-nowrap">
                                                            {String(val)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="mt-2 text-xs text-center text-[var(--text-muted)]">
                                        Mostrando primeras 5 filas
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
