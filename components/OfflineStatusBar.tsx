'use client';

import { useOfflineSync, usePWAInstall } from '@/hooks/useOfflineSync';
import { Wifi, WifiOff, Download, Check, RefreshCw } from 'lucide-react';

export function OfflineStatusBar() {
    const { isOnline, isRegistered, pendingSync, lastSync, triggerSync } = useOfflineSync();
    const { canInstall, isInstalled, promptInstall } = usePWAInstall();

    // Only show when offline or has pending sync
    if (isOnline && pendingSync === 0 && !canInstall) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 80,
                left: 16,
                right: 16,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
            }}
        >
            {/* Offline Indicator */}
            {!isOnline && (
                <div
                    style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    }}
                >
                    <WifiOff size={20} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Sin conexión</div>
                        <div style={{ fontSize: 12, opacity: 0.9 }}>
                            Los cambios se guardarán localmente
                        </div>
                    </div>
                </div>
            )}

            {/* Pending Sync */}
            {isOnline && pendingSync > 0 && (
                <div
                    style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    }}
                >
                    <RefreshCw size={20} className="animate-spin" />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Sincronizando...</div>
                        <div style={{ fontSize: 12, opacity: 0.9 }}>
                            {pendingSync} {pendingSync === 1 ? 'cambio pendiente' : 'cambios pendientes'}
                        </div>
                    </div>
                    <button
                        onClick={triggerSync}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Sincronizar
                    </button>
                </div>
            )}

            {/* Install Prompt */}
            {canInstall && !isInstalled && (
                <div
                    style={{
                        background: 'linear-gradient(135deg, #1e3654 0%, #0f172a 100%)',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        boxShadow: '0 4px 12px rgba(30, 54, 84, 0.3)',
                    }}
                >
                    <Download size={20} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Instalar App</div>
                        <div style={{ fontSize: 12, opacity: 0.9 }}>
                            Acceso rápido desde tu pantalla
                        </div>
                    </div>
                    <button
                        onClick={promptInstall}
                        style={{
                            background: '#0ea5e9',
                            border: 'none',
                            borderRadius: 8,
                            padding: '8px 16px',
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Instalar
                    </button>
                </div>
            )}

            {/* SW Status (dev mode only) */}
            {process.env.NODE_ENV === 'development' && (
                <div
                    style={{
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: 10,
                        display: 'flex',
                        gap: 12,
                    }}
                >
                    <span>{isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}</span>
                    <span>SW: {isRegistered ? <Check size={12} /> : '...'}</span>
                    {lastSync && <span>Sync: {lastSync.toLocaleTimeString()}</span>}
                </div>
            )}
        </div>
    );
}
