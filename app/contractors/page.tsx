'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Phone,
  Mail,
  Calendar,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  TrendingUp,
  X,
} from 'lucide-react';

interface Contractor {
  id: string;
  name: string;
  rut: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contractStart: string;
  contractEnd: string;
  status: 'active' | 'inactive' | 'suspended';
  certifications: string[];
  complianceRate?: number;
  tasksCompleted?: number;
  tasksTotal?: number;
}

// Contratistas reales - inicialmente vacío hasta que se agreguen empresas reales
const INITIAL_CONTRACTORS: Contractor[] = [];

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contractStart: '',
    contractEnd: '',
  });

  const loadContractors = useCallback(() => {
    // In production, this would fetch from Supabase
    setContractors(INITIAL_CONTRACTORS);
  }, []);

  useEffect(() => {
    loadContractors();
  }, [loadContractors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newContractor: Contractor = {
      id: `contractor-${Date.now()}`,
      ...formData,
      status: 'active',
      certifications: [],
      complianceRate: 0,
      tasksCompleted: 0,
      tasksTotal: 0,
    };
    setContractors(prev => [...prev, newContractor]);
    setShowForm(false);
    setFormData({
      name: '',
      rut: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contractStart: '',
      contractEnd: '',
    });
  };

  const getStatusBadge = (status: Contractor['status']) => {
    const config = {
      active: { class: 'badge-success', icon: CheckCircle2, text: 'Activo' },
      inactive: { class: 'badge-secondary', icon: Clock, text: 'Inactivo' },
      suspended: { class: 'badge-danger', icon: AlertTriangle, text: 'Suspendido' },
    };
    const { class: cls, icon: Icon, text } = config[status];
    return (
      <span className={`badge ${cls}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        <Icon style={{ width: 12, height: 12 }} />
        {text}
      </span>
    );
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return 'var(--success-500)';
    if (rate >= 85) return 'var(--warning-500)';
    return 'var(--danger-500)';
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            <nav className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Dashboard</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Empresas Contratistas</span>
            </nav>

            <header className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title">Empresas Contratistas</h1>
                  <p className="page-subtitle">
                    Gestión de empresas externas de lubricación y mantenimiento
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                  <Plus style={{ width: 16, height: 16 }} />
                  Nueva Empresa
                </button>
              </div>
            </header>

            {/* Summary Cards */}
            <div className="dashboard-grid" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="col-span-4">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon primary">
                      <Building2 style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <div>
                    <span className="stat-value">{contractors.length}</span>
                    <span className="stat-label">Empresas Activas</span>
                  </div>
                </div>
              </div>
              <div className="col-span-4">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon success">
                      <TrendingUp style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <div>
                    <span className="stat-value">
                      {contractors.length > 0
                        ? (contractors.reduce((acc, c) => acc + (c.complianceRate || 0), 0) / contractors.length).toFixed(1)
                        : 0}%
                    </span>
                    <span className="stat-label">Cumplimiento Promedio</span>
                  </div>
                </div>
              </div>
              <div className="col-span-4">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon accent">
                      <FileText style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <div>
                    <span className="stat-value">
                      {contractors.reduce((acc, c) => acc + (c.tasksCompleted || 0), 0).toLocaleString()}
                    </span>
                    <span className="stat-label">Tareas Ejecutadas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contractors Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
              {contractors.map(contractor => (
                <div
                  key={contractor.id}
                  className="card"
                  style={{ cursor: 'pointer', transition: 'all var(--duration-normal)' }}
                  onClick={() => setSelectedContractor(contractor)}
                >
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                      <div>
                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                          {contractor.name}
                        </h3>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                          RUT: {contractor.rut}
                        </span>
                      </div>
                      {getStatusBadge(contractor.status)}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        <Mail style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{contractor.contactEmail}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        <Phone style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>{contractor.contactPhone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        <Calendar style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Hasta {new Date(contractor.contractEnd).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                        <Award style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {contractor.certifications.length} certificaciones
                        </span>
                      </div>
                    </div>

                    {/* Compliance Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)' }}>
                          CUMPLIMIENTO SLA
                        </span>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: getComplianceColor(contractor.complianceRate || 0) }}>
                          {contractor.complianceRate?.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ height: 8, background: 'var(--slate-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${contractor.complianceRate || 0}%`,
                            background: getComplianceColor(contractor.complianceRate || 0),
                            transition: 'width var(--duration-normal)',
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                          {contractor.tasksCompleted?.toLocaleString()} / {contractor.tasksTotal?.toLocaleString()} tareas
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                          Meta: 95%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Contractor Detail Modal */}
        {selectedContractor && (
          <div className="modal-overlay" onClick={() => setSelectedContractor(null)}>
            <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">{selectedContractor.name}</h2>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    RUT: {selectedContractor.rut}
                  </span>
                </div>
                <button className="modal-close" onClick={() => setSelectedContractor(null)}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <div style={{ padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
                        Contacto
                      </span>
                      <span style={{ fontWeight: 600 }}>{selectedContractor.contactName}</span>
                    </div>
                    <div style={{ padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
                        Estado
                      </span>
                      {getStatusBadge(selectedContractor.status)}
                    </div>
                    <div style={{ padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
                        Inicio Contrato
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        {new Date(selectedContractor.contractStart).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                    <div style={{ padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}>
                        Fin Contrato
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        {new Date(selectedContractor.contractEnd).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: 'var(--space-2)' }}>
                      Certificaciones
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {selectedContractor.certifications.map(cert => (
                        <span key={cert} className="badge badge-primary">{cert}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-4)', background: 'linear-gradient(135deg, var(--primary-800), var(--primary-900))', borderRadius: 'var(--radius-lg)', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8, display: 'block' }}>CUMPLIMIENTO SLA</span>
                        <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
                          {selectedContractor.complianceRate?.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8, display: 'block' }}>TAREAS EJECUTADAS</span>
                        <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                          {selectedContractor.tasksCompleted?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedContractor(null)}>
                  Cerrar
                </button>
                <Link href={`/contractors/${selectedContractor.id}/audits`} className="btn btn-primary">
                  Ver Auditorías
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* New Contractor Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Nueva Empresa Contratista</h2>
                <button className="modal-close" onClick={() => setShowForm(false)}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                      <label className="form-label">Nombre de la Empresa *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Ej: Lubricación Profesional Ltda."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">RUT *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.rut}
                        onChange={e => setFormData({ ...formData, rut: e.target.value })}
                        required
                        placeholder="76.XXX.XXX-X"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nombre Contacto *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.contactName}
                        onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                      <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-input"
                          value={formData.contactEmail}
                          onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Teléfono</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={formData.contactPhone}
                          onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                      <div className="form-group">
                        <label className="form-label">Inicio Contrato *</label>
                        <input
                          type="date"
                          className="form-input"
                          value={formData.contractStart}
                          onChange={e => setFormData({ ...formData, contractStart: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Fin Contrato *</label>
                        <input
                          type="date"
                          className="form-input"
                          value={formData.contractEnd}
                          onChange={e => setFormData({ ...formData, contractEnd: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Empresa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
