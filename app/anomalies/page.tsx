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
                  <button className="btn-premium btn-premium-ghost" onClick={handleExportPDF}>
                    <FileDown style={{ width: 16, height: 16 }} />
                    Exportar PDF
                  </button>
                  <button className="btn-premium btn-premium-primary" onClick={() => setShowForm(true)}>
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
                  className={`btn-premium ${filter === f ? 'btn-premium-primary' : 'btn-premium-ghost'}`}
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? `Todas (${anomalies.length})` : f === 'open' ? `Abiertas (${anomalies.filter(a => a.status !== 'resuelta').length})` : `Resueltas (${anomalies.filter(a => a.status === 'resuelta').length})`}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="card-glass" style={{ overflow: 'hidden' }}>
              <div style={{ padding: 0 }}>
                {filteredAnomalies.map(anomaly => (
                  <div
                    key={anomaly.id}
                    className="task-item"
                    style={{ borderRadius: 0, margin: 0, borderBottom: '1px solid var(--glass-border)' }}
                  >
                    <div style={{
                      width: 4,
                      height: 40,
                      borderRadius: 2,
                      background: anomaly.severity === 'critica' ? 'var(--led-alarm)' : anomaly.severity === 'alta' ? 'var(--led-warning)' : anomaly.severity === 'media' ? 'var(--led-info)' : 'var(--led-on)',
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{anomaly.machine?.name || anomaly.lubricationPoint?.code || 'General'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(anomaly.createdAt).toLocaleDateString('es-CL')}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{anomaly.description}</p>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span className={`badge-premium ${anomaly.severity === 'critica' ? 'danger' : anomaly.severity === 'alta' ? 'warning' : anomaly.severity === 'media' ? 'pending' : 'success'}`}>{anomaly.severity.toUpperCase()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {anomaly.status === 'resuelta' ? <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--led-on)' }} /> : anomaly.status === 'en_revision' ? <Clock style={{ width: 14, height: 14, color: 'var(--led-warning)' }} /> : <AlertTriangle style={{ width: 14, height: 14, color: 'var(--led-alarm)' }} />}
                          {anomaly.status === 'resuelta' ? 'Resuelta' : anomaly.status === 'en_revision' ? 'En Revisión' : 'Abierta'}
                        </span>
                      </div>
                    </div>
                    {anomaly.status !== 'resuelta' && (
                      <button
                        className="btn-premium btn-premium-ghost"
                        style={{ padding: '8px' }}
                        onClick={() => handleResolve(anomaly.id)}
                        title="Marcar como resuelta"
                      >
                        <CheckCircle2 style={{ width: 18, height: 18, color: 'var(--led-on)' }} />
                      </button>
                    )}
                  </div>
                ))}
                {filteredAnomalies.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <AlertTriangle size={32} />
                    </div>
                    <div className="empty-state-title">Sin anomalías</div>
                    <p className="empty-state-description">No hay registros con el filtro seleccionado.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal - Outside app-layout for proper z-index */}
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
    </ProtectedRoute>
  );
}
