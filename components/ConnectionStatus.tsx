'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Cloud, CloudOff } from 'lucide-react';
import { getSyncStatus, onSyncStatusChange, syncDataService, SyncStatus } from '@/lib/data-sync';

export default function ConnectionStatus() {
  const [status, setStatus] = useState<SyncStatus>({ isOnline: true, lastSync: null, isSyncing: false });
  const [pendingCount, setPendingCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setStatus(getSyncStatus());
    setPendingCount(syncDataService.getPendingCount());

    const unsubscribe = onSyncStatusChange((newStatus) => {
      setStatus(newStatus);
      setPendingCount(syncDataService.getPendingCount());
    });

    return unsubscribe;
  }, []);

  const handleSync = async () => {
    await syncDataService.syncNow();
    setPendingCount(syncDataService.getPendingCount());
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Nunca';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="connection-status" style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          borderRadius: '20px',
          border: 'none',
          background: status.isOnline 
            ? (pendingCount > 0 ? 'var(--warning-100)' : 'var(--success-100)')
            : 'var(--error-100)',
          color: status.isOnline 
            ? (pendingCount > 0 ? 'var(--warning-700)' : 'var(--success-700)')
            : 'var(--error-700)',
          fontSize: '12px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {status.isSyncing ? (
          <RefreshCw size={14} className="animate-spin" />
        ) : status.isOnline ? (
          pendingCount > 0 ? <Cloud size={14} /> : <Wifi size={14} />
        ) : (
          <WifiOff size={14} />
        )}
        <span>
          {status.isSyncing 
            ? 'Sincronizando...' 
            : status.isOnline 
              ? (pendingCount > 0 ? `${pendingCount} pendiente${pendingCount > 1 ? 's' : ''}` : 'Conectado')
              : 'Sin conexión'
          }
        </span>
      </button>

      {showDetails && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            padding: '12px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 1000,
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {status.isOnline ? (
                <Wifi size={16} style={{ color: 'var(--success-500)' }} />
              ) : (
                <CloudOff size={16} style={{ color: 'var(--error-500)' }} />
              )}
              <span style={{ fontWeight: 600, fontSize: '13px' }}>
                {status.isOnline ? 'En línea' : 'Sin conexión'}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--slate-500)', margin: 0 }}>
              Última sync: {formatLastSync(status.lastSync)}
            </p>
          </div>

          {pendingCount > 0 && (
            <div style={{ 
              padding: '8px', 
              background: 'var(--warning-50)', 
              borderRadius: '6px',
              marginBottom: '8px',
              fontSize: '12px',
            }}>
              <strong>{pendingCount}</strong> cambio{pendingCount > 1 ? 's' : ''} sin sincronizar
            </div>
          )}

          {status.isOnline && pendingCount > 0 && (
            <button
              onClick={handleSync}
              disabled={status.isSyncing}
              style={{
                width: '100%',
                padding: '8px',
                background: 'var(--primary-600)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: status.isSyncing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <RefreshCw size={14} className={status.isSyncing ? 'animate-spin' : ''} />
              {status.isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}
            </button>
          )}

          {!status.isOnline && (
            <p style={{ fontSize: '11px', color: 'var(--slate-500)', margin: 0, textAlign: 'center' }}>
              Los cambios se guardarán localmente y se sincronizarán cuando vuelva la conexión.
            </p>
          )}
        </div>
      )}

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
