'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, AlertTriangle, Clock, CheckCircle2, X, FileDown } from 'lucide-react';
import { dataService } from '@/lib/data';
import { generateAnomalyReportPDF } from '@/lib/pdf';
import { Anomaly, Machine, LubricationPoint, AnomalySeverity } from '@/lib/types';

interface EnrichedAnomaly extends Anomaly {
  machine?: Machine;
  lubricationPoint?: LubricationPoint;
}

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<EnrichedAnomaly[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [newAnomaly, setNewAnomaly] = useState({ description: '', severity: 'media' as AnomalySeverity, machineId: '' });

  const loadAnomalies = useCallback(() => {
    const raw = dataService.getAnomalies();
    const machines = dataService.getMachines();
    const points = dataService.getLubricationPoints();

    const enriched: EnrichedAnomaly[] = raw.map(a => ({
      ...a,
      machine: a.machineId ? machines.find(m => m.id === a.machineId) : undefined,
      lubricationPoint: a.lubricationPointId ? points.find(p => p.id === a.lubricationPointId) : undefined,
    }));

    setAnomalies(enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  useEffect(() => { loadAnomalies(); }, [loadAnomalies]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnomaly.description.length < 10) {
      toast.error('La descripción debe tener al menos 10 caracteres');
      return;
    }
    dataService.addAnomaly({ ...newAnomaly, reportedBy: 'user-2', status: 'abierta' });
    toast.success('Anomalía registrada correctamente');
    setShowForm(false);
    setNewAnomaly({ description: '', severity: 'media', machineId: '' });
    loadAnomalies();
  };

  const handleResolve = (id: string) => {
    dataService.updateAnomaly(id, { status: 'resuelta', resolvedAt: new Date().toISOString() });
    toast.success('Anomalía marcada como resuelta');
    loadAnomalies();
  };

  const handleExportPDF = () => {
    const pdfData = filteredAnomalies.map(a => ({
      id: a.id,
      description: a.description,
      severity: a.severity,
      status: a.status,
      machine: a.machine?.name,
      point: a.lubricationPoint?.code,
      reporter: 'Técnico',
      date: new Date(a.createdAt).toLocaleDateString('es-CL'),
    }));
    generateAnomalyReportPDF(pdfData);
    toast.success('Reporte PDF descargado');
  };

  const filteredAnomalies = anomalies.filter(a => {
    if (filter === 'open') return a.status !== 'resuelta';
    if (filter === 'resolved') return a.status === 'resuelta';
    return true;
  });

  const getSeverityBadge = (severity: AnomalySeverity) => {
    const classes: Record<AnomalySeverity, string> = {
      critica: 'badge-danger',
      alta: 'badge-warning',
      media: 'badge-primary',
      baja: 'badge-success',
    };
    return classes[severity];
  };

  const machines = dataService.getMachines();

  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            <nav className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Dashboard</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Anomalías</span>
            </nav>

            <header className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title">Registro de Anomalías</h1>
                  <p className="page-subtitle">Hallazgos y observaciones en terreno</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button className="btn btn-secondary" onClick={handleExportPDF}>
                    <FileDown style={{ width: 16, height: 16 }} />
                    Exportar PDF
                  </button>
                  <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus style={{ width: 16, height: 16 }} />
                    Nueva Anomalía
                  </button>
                </div>
              </div>
            </header>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
              {(['all', 'open', 'resolved'] as const).map(f => (
                <button
                  key={f}
                  className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: 'var(--text-sm)' }}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? `Todas (${anomalies.length})` : f === 'open' ? `Abiertas (${anomalies.filter(a => a.status !== 'resuelta').length})` : `Resueltas (${anomalies.filter(a => a.status === 'resuelta').length})`}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="card">
              <div className="card-body" style={{ padding: 0 }}>
                {filteredAnomalies.map(anomaly => (
                  <div
                    key={anomaly.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-5) var(--space-6)',
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background var(--duration-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-50)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: 6,
                      height: 40,
                      borderRadius: 3,
                      background: anomaly.severity === 'critica' ? 'var(--accent-500)' : anomaly.severity === 'alta' ? 'var(--warning-500)' : anomaly.severity === 'media' ? 'var(--primary-500)' : 'var(--success-500)',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{anomaly.machine?.name || anomaly.lubricationPoint?.code || 'General'}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{new Date(anomaly.createdAt).toLocaleDateString('es-CL')}</span>
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>{anomaly.description}</p>
                      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                        <span className={`badge ${getSeverityBadge(anomaly.severity)}`}>{anomaly.severity.toUpperCase()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                          {anomaly.status === 'resuelta' ? <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--success-500)' }} /> : anomaly.status === 'en_revision' ? <Clock style={{ width: 14, height: 14, color: 'var(--warning-500)' }} /> : <AlertTriangle style={{ width: 14, height: 14, color: 'var(--accent-500)' }} />}
                          {anomaly.status === 'resuelta' ? 'Resuelta' : anomaly.status === 'en_revision' ? 'En Revisión' : 'Abierta'}
                        </span>
                      </div>
                    </div>
                    {anomaly.status !== 'resuelta' && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleResolve(anomaly.id)}
                        title="Marcar como resuelta"
                      >
                        <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--success-500)' }} />
                      </button>
                    )}
                  </div>
                ))}
                {filteredAnomalies.length === 0 && (
                  <div className="empty-state">
                    <AlertTriangle className="empty-state-icon" />
                    <h2 className="empty-state-title">Sin anomalías</h2>
                    <p className="empty-state-description">No hay registros con el filtro seleccionado.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Reportar Anomalía</h2>
                <button className="modal-close" onClick={() => setShowForm(false)}><X style={{ width: 16, height: 16 }} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Máquina (opcional)</label>
                    <select className="form-select" value={newAnomaly.machineId} onChange={e => setNewAnomaly(prev => ({ ...prev, machineId: e.target.value }))}>
                      <option value="">Seleccionar...</option>
                      {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Severidad</label>
                    <select className="form-select" value={newAnomaly.severity} onChange={e => setNewAnomaly(prev => ({ ...prev, severity: e.target.value as AnomalySeverity }))}>
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descripción *</label>
                    <textarea className="form-textarea" value={newAnomaly.description} onChange={e => setNewAnomaly(prev => ({ ...prev, description: e.target.value }))} placeholder="Describa el hallazgo con detalle..." rows={4} required minLength={10} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar Anomalía</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
