'use client';

import { useRef, useEffect, useState } from 'react';
import SignaturePadLib from 'signature_pad';
import { Eraser, Check, X } from 'lucide-react';

interface SignaturePadProps {
    onSave: (dataUrl: string) => void;
    onCancel: () => void;
    width?: number;
    height?: number;
}

export default function SignaturePad({ onSave, onCancel, width = 400, height = 200 }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const signaturePadRef = useRef<SignaturePadLib | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        if (canvasRef.current) {
            signaturePadRef.current = new SignaturePadLib(canvasRef.current, {
                backgroundColor: 'rgb(255, 255, 255)',
                penColor: 'rgb(15, 23, 42)',
            });

            signaturePadRef.current.addEventListener('endStroke', () => {
                setIsEmpty(signaturePadRef.current?.isEmpty() ?? true);
            });
        }

        return () => {
            signaturePadRef.current?.off();
        };
    }, []);

    const handleClear = () => {
        signaturePadRef.current?.clear();
        setIsEmpty(true);
    };

    const handleSave = () => {
        if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
            const dataUrl = signaturePadRef.current.toDataURL('image/png');
            onSave(dataUrl);
        }
    };

    return (
        <div className="signature-container">
            <div className="signature-header">
                <h3>Firma Digital</h3>
                <p>Firme dentro del recuadro para confirmar la ejecución</p>
            </div>

            <div className="signature-canvas-wrapper">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="signature-canvas"
                />
            </div>

            <div className="signature-actions">
                <button type="button" className="btn btn-ghost" onClick={handleClear} disabled={isEmpty}>
                    <Eraser style={{ width: 16, height: 16 }} />
                    Limpiar
                </button>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        <X style={{ width: 16, height: 16 }} />
                        Cancelar
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isEmpty}>
                        <Check style={{ width: 16, height: 16 }} />
                        Confirmar Firma
                    </button>
                </div>
            </div>

            <style jsx>{`
        .signature-container {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-6);
        }

        .signature-header {
          margin-bottom: var(--space-4);
        }

        .signature-header h3 {
          font-size: var(--text-lg);
          font-weight: 600;
          margin-bottom: var(--space-1);
        }

        .signature-header p {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .signature-canvas-wrapper {
          border: 2px solid var(--primary-200);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: var(--space-4);
        }

        .signature-canvas {
          display: block;
          width: 100%;
          cursor: crosshair;
          touch-action: none;
        }

        .signature-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
        </div>
    );
}
