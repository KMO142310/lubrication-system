'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getAuditLogs } from '@/lib/anti-fraud';
import { getSyncStatus, onSyncStatusChange, syncDataService } from '@/lib/sync';

export default function AuditCyclePage() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [syncStatus, setSyncStatus] = useState(getSyncStatus());
  const [isRunning, setIsRunning] = useState(false);

  const logs = useMemo(() => getAuditLogs().slice(0, 100), []);

  const refresh = () => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    setPendingCount(syncDataService.getPendingCount());
    setSyncStatus(getSyncStatus());
  };

  useEffect(() => {
    refresh();

    const unsubscribe = onSyncStatusChange(next => {
      setSyncStatus(next);
      setPendingCount(syncDataService.getPendingCount());
    });

    const handleOnline = () => refresh();
    const handleOffline = () => refresh();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runAudit = async () => {
    setIsRunning(true);
    try {
      await syncDataService.syncNow();
      refresh();
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['desarrollador']}>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            <header className="page-header">
              <h1 className="page-title">/audit-cycle</h1>
              <p className="page-subtitle">Verificación rápida de salud del sistema (sync + auditoría)</p>
            </header>

            <div className="dashboard-grid">
              <div className="col-span-6">
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Estado</span>
                  </div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Conexión</span>
                      <span style={{ fontWeight: 600 }}>{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Cola pendiente</span>
                      <span style={{ fontWeight: 600 }}>{pendingCount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Sync en curso</span>
                      <span style={{ fontWeight: 600 }}>{syncStatus.isSyncing ? 'Sí' : 'No'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Último sync</span>
                      <span style={{ fontWeight: 600 }}>{syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : '—'}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-primary" onClick={runAudit} disabled={isRunning}>
                        {isRunning ? 'Ejecutando...' : 'Ejecutar audit-cycle'}
                      </button>
                      <button className="btn btn-ghost" onClick={refresh} disabled={isRunning}>
                        Refrescar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-6">
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Últimos logs locales (anti-fraud)</span>
                  </div>
                  <div className="card-body" style={{ padding: 0 }}>
                    {logs.length === 0 ? (
                      <div style={{ padding: 'var(--space-6)', color: 'var(--text-muted)' }}>Sin registros todavía.</div>
                    ) : (
                      logs.map(l => (
                        <div
                          key={l.id}
                          style={{
                            padding: 'var(--space-4) var(--space-6)',
                            borderBottom: '1px solid var(--border-subtle)',
                            display: 'flex',
                            gap: 'var(--space-3)',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {l.action}
                            </div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {l.details}
                            </div>
                          </div>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {new Date(l.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
