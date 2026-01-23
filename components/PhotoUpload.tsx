'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, X, Upload, Image as ImageIcon, AlertTriangle, Loader2 } from 'lucide-react';
import { generateImageHash, checkDuplicatePhoto, registerPhoto, createFraudAlert } from '@/lib/anti-fraud';
import { uploadPhotoToStorage } from '@/lib/data-sync';

interface PhotoUploadProps {
    label: string;
    onPhotoCapture: (dataUrl: string) => void;
    existingPhoto?: string;
    required?: boolean;
    taskId?: string;
    userId?: string;
    photoType?: 'before' | 'after';
}

export default function PhotoUpload({ 
    label, 
    onPhotoCapture, 
    existingPhoto, 
    required,
    taskId = 'unknown',
    userId = 'unknown',
    photoType = 'after'
}: PhotoUploadProps) {
    const [photo, setPhoto] = useState<string | null>(existingPhoto || null);
    const [showCamera, setShowCamera] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Verificar foto duplicada y registrar
    const processPhoto = async (dataUrl: string) => {
        setDuplicateWarning(null);
        
        try {
            const hash = await generateImageHash(dataUrl);
            const duplicate = checkDuplicatePhoto(hash);
            
            if (duplicate) {
                // ¡FOTO DUPLICADA DETECTADA!
                const duplicateDate = new Date(duplicate.timestamp).toLocaleString('es-CL');
                setDuplicateWarning(
                    `⚠️ Esta foto ya fue usada el ${duplicateDate} en otra tarea. Por favor tome una foto nueva.`
                );
                
                // Crear alerta de fraude
                createFraudAlert({
                    type: 'duplicate_photo',
                    severity: 'high',
                    userId,
                    taskId,
                    description: `Intento de reutilizar foto del ${duplicateDate} (Tarea original: ${duplicate.taskId})`,
                });
                
                // NO registrar la foto, devolver null
                return false;
            }
            
            // Registrar foto nueva
            registerPhoto({
                hash,
                timestamp: new Date().toISOString(),
                deviceInfo: navigator.userAgent,
                taskId,
                userId,
                type: photoType,
            });
            
            return true;
        } catch (error) {
            console.error('Error processing photo:', error);
            return true; // En caso de error, permitir la foto
        }
    };

    const startCamera = async () => {
        try {
            // Primero mostrar el contenedor de la cámara
            setShowCamera(true);
            
            // Esperar un momento para que el DOM se actualice
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment', 
                    width: { ideal: 1280 }, 
                    height: { ideal: 720 } 
                }
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Esperar a que el video esté listo
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().catch(console.error);
                };
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setShowCamera(false);
            // Fallback to file input if camera not available
            fileInputRef.current?.click();
        }
    };

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
    }, []);

    const capturePhoto = async () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);

                // Add timestamp watermark with task info
                const timestamp = new Date().toLocaleString('es-CL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
                ctx.fillStyle = 'white';
                ctx.font = 'bold 14px Inter, sans-serif';
                ctx.fillText(`AISA Lubricación | ${timestamp}`, 12, canvas.height - 28);
                ctx.font = '12px Inter, sans-serif';
                ctx.fillText(`Tarea: ${taskId} | Usuario: ${userId}`, 12, canvas.height - 10);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                
                // Verificar si la foto es duplicada
                const isValid = await processPhoto(dataUrl);
                
                if (isValid) {
                    setPhoto(dataUrl);
                    setIsUploading(true);
                    
                    // Subir a Supabase Storage
                    const uploadedUrl = await uploadPhotoToStorage(dataUrl, taskId, photoType);
                    setIsUploading(false);
                    
                    onPhotoCapture(uploadedUrl || dataUrl);
                }
            }

            stopCamera();
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;

                // Add watermark to uploaded image too
                const img = new window.Image();
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');

                    if (ctx) {
                        ctx.drawImage(img, 0, 0);

                        const timestamp = new Date().toLocaleString('es-CL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        });

                        const barHeight = Math.max(50, img.height * 0.06);
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                        ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);
                        ctx.fillStyle = 'white';
                        ctx.font = `bold ${Math.max(14, img.height * 0.02)}px Inter, sans-serif`;
                        ctx.fillText(`AISA Lubricación | ${timestamp}`, 12, canvas.height - barHeight * 0.55);
                        ctx.font = `${Math.max(12, img.height * 0.015)}px Inter, sans-serif`;
                        ctx.fillText(`Tarea: ${taskId} | Usuario: ${userId}`, 12, canvas.height - barHeight * 0.2);

                        const watermarkedUrl = canvas.toDataURL('image/jpeg', 0.8);
                        
                        // Verificar si la foto es duplicada
                        const isValid = await processPhoto(watermarkedUrl);
                        
                        if (isValid) {
                            setPhoto(watermarkedUrl);
                            setIsUploading(true);
                            
                            // Subir a Supabase Storage
                            const uploadedUrl = await uploadPhotoToStorage(watermarkedUrl, taskId, photoType);
                            setIsUploading(false);
                            
                            onPhotoCapture(uploadedUrl || watermarkedUrl);
                        }
                    }
                };
                img.src = dataUrl;
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        onPhotoCapture('');
    };

    return (
        <div className="photo-upload">
            <div className="photo-upload-label">
                <span>{label}</span>
                {required && <span className="required-badge">Requerido</span>}
            </div>

            {/* Alerta de foto duplicada */}
            {duplicateWarning && (
                <div className="duplicate-warning" style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: '2px solid #ef4444',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                }}>
                    <AlertTriangle style={{ width: 20, height: 20, color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '14px', marginBottom: '4px' }}>
                            FOTO DUPLICADA DETECTADA
                        </div>
                        <div style={{ color: '#b91c1c', fontSize: '13px', lineHeight: 1.4 }}>
                            {duplicateWarning}
                        </div>
                    </div>
                </div>
            )}

            {photo ? (
                <div className="photo-preview">
                    <img src={photo} alt="Foto capturada" />
                    <button className="photo-remove" onClick={removePhoto} type="button" disabled={isUploading}>
                        <X style={{ width: 16, height: 16 }} />
                    </button>
                    <div className="photo-success" style={{
                        background: isUploading ? 'var(--warning-100)' : 'var(--success-100)',
                        color: isUploading ? 'var(--warning-700)' : 'var(--success-700)',
                    }}>
                        {isUploading ? (
                            <>
                                <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <ImageIcon style={{ width: 14, height: 14 }} />
                                Foto adjunta
                            </>
                        )}
                    </div>
                </div>
            ) : showCamera ? (
                <div className="camera-container">
                    <video ref={videoRef} autoPlay playsInline muted />
                    <div className="camera-controls">
                        <button className="btn btn-secondary" onClick={stopCamera} type="button">
                            Cancelar
                        </button>
                        <button className="btn btn-primary capture-btn" onClick={capturePhoto} type="button">
                            <Camera style={{ width: 20, height: 20 }} />
                            Capturar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="photo-actions">
                    <button className="photo-btn camera" onClick={startCamera} type="button">
                        <Camera style={{ width: 24, height: 24 }} />
                        <span>Usar Cámara</span>
                    </button>
                    <button className="photo-btn upload" onClick={() => fileInputRef.current?.click()} type="button">
                        <Upload style={{ width: 24, height: 24 }} />
                        <span>Subir Archivo</span>
                    </button>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
            />

            <style jsx>{`
        .photo-upload {
          margin-bottom: var(--space-4);
        }

        .photo-upload-label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
          font-weight: 600;
          font-size: var(--text-sm);
        }

        .required-badge {
          font-size: var(--text-xs);
          padding: 2px 8px;
          background: var(--accent-100);
          color: var(--accent-600);
          border-radius: var(--radius-full);
          font-weight: 500;
        }

        .photo-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }

        .photo-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-6);
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          background: var(--slate-50);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--duration-fast);
        }

        .photo-btn:hover {
          border-color: var(--primary-400);
          background: var(--primary-50);
          color: var(--primary-600);
        }

        .photo-btn.camera:hover {
          border-color: var(--accent-400);
          background: var(--accent-100);
          color: var(--accent-600);
        }

        .photo-btn span {
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .camera-container {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: black;
        }

        .camera-container video {
          width: 100%;
          display: block;
        }

        .camera-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
        }

        .capture-btn {
          min-width: 140px;
        }

        .photo-preview {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 2px solid var(--success-400);
        }

        .photo-preview img {
          width: 100%;
          display: block;
        }

        .photo-remove {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: rgba(0,0,0,0.6);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background var(--duration-fast);
        }

        .photo-remove:hover {
          background: var(--accent-500);
        }

        .photo-success {
          position: absolute;
          bottom: var(--space-2);
          left: var(--space-2);
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-3);
          background: var(--success-500);
          color: white;
          font-size: var(--text-xs);
          font-weight: 600;
          border-radius: var(--radius-full);
        }
      `}</style>
        </div>
    );
}
