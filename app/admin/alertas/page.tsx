'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
  MapPin,
  Camera,
  Zap,
  User,
  Calendar,
  Eye,
  CheckCheck,
} from 'lucide-react';
import {
  getFraudAlerts,
  resolveFraudAlert,
  getSecuritySummary,
  getAuditLogs,
  type FraudAlert,
  type SecuritySummary,
} from '@/lib/anti-fraud';
import { useAuth } from '@/lib/auth';

export default function AlertasPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [summary, setSummary] = useState<SecuritySummary | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);

  const loadData = () => {
    setAlerts(getFraudAlerts(showResolved));
    setSummary(getSecuritySummary());
  };

  useEffect(() => {
    loadData();
  }, [showResolved]);

  const handleResolve = (alertId: string) => {
    if (user) {
      resolveFraudAlert(alertId, user.name);
      loadData();
      setSelectedAlert(null);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'duplicate_photo': return <Camera style={{ width: 20, height: 20 }} />;
      case 'location_mismatch': return <MapPin style={{ width: 20, height: 20 }} />;
      case 'rapid_completion': return <Zap style={{ width: 20, height: 20 }} />;
      case 'suspicious_time': return <Clock style={{ width: 20, height: 20 }} />;
      default: return <AlertTriangle style={{ width: 20, height: 20 }} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' };
      case 'medium': return { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' };
      case 'low': return { bg: '#f0fdf4', border: '#22c55e', text: '#166534' };
      default: return { bg: '#f8fafc', border: '#94a3b8', text: '#475569' };
    }
  };

  const getAlertTypeName = (type: string) => {
    switch (type) {
      case 'duplicate_photo': return 'Foto Duplicada';
      case 'location_mismatch': return 'Ubicación Sospechosa';
      case 'rapid_completion': return 'Completado Muy Rápido';
      case 'suspicious_time': return 'Horario Sospechoso';
      default: return type;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['desarrollador', 'supervisor']}>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            <nav className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Dashboard</Link>
              <span className="breadcrumb-separator">/</span>
              <Link href="/admin" className="breadcrumb-link">Admin</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Alertas de Seguridad</span>
            </nav>

            <header className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield style={{ width: 28, height: 28, color: '#ef4444' }} />
                    Centro de Seguridad
                  </h1>
                  <p className="page-subtitle">Monitoreo de alertas y actividad sospechosa</p>
                </div>
              </div>
            </header>

            {/* Summary Cards */}
            {summary && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
                marginBottom: '24px',
              }}>
                <div style={{
                  background: summary.unresolvedAlerts > 0 ? '#fef2f2' : '#f0fdf4',
                  borderRadius: '12px',
                  padding: '16px',
                  border: `2px solid ${summary.unresolvedAlerts > 0 ? '#ef4444' : '#22c55e'}`,
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: summary.unresolvedAlerts > 0 ? '#991b1b' : '#166534' }}>
                    {summary.unresolvedAlerts}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Alertas Pendientes</div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>
                    {summary.totalAlerts}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Total Histórico</div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>
                    {summary.todayActions}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Acciones Hoy</div>
                </div>

                <div style={{
                  background: summary.suspiciousUsers.length > 0 ? '#fffbeb' : '#f8fafc',
                  borderRadius: '12px',
                  padding: '16px',
                  border: `1px solid ${summary.suspiciousUsers.length > 0 ? '#f59e0b' : '#e2e8f0'}`,
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: summary.suspiciousUsers.length > 0 ? '#92400e' : '#1e293b' }}>
                    {summary.suspiciousUsers.length}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Usuarios Sospechosos</div>
                </div>
              </div>
            )}

            {/* Suspicious Users */}
            {summary && summary.suspiciousUsers.length > 0 && (
              <div style={{
                background: '#fffbeb',
                border: '2px solid #f59e0b',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
              }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User style={{ width: 20, height: 20 }} />
                  Usuarios con Múltiples Alertas
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {summary.suspiciousUsers.map(u => (
                    <span key={u.userId} style={{
                      background: '#fef3c7',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#92400e',
                    }}>
                      {u.userId}: {u.alertCount} alertas
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showResolved}
                  onChange={(e) => setShowResolved(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '14px', color: '#64748b' }}>Mostrar alertas resueltas</span>
              </label>
            </div>

            {/* Alerts List */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Alertas de Fraude</span>
                <span style={{
                  background: alerts.length > 0 ? '#ef4444' : '#22c55e',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}>
                  {alerts.length} {alerts.length === 1 ? 'alerta' : 'alertas'}
                </span>
              </div>

              <div className="card-body" style={{ padding: 0 }}>
                {alerts.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <CheckCircle style={{ width: 48, height: 48, color: '#22c55e', marginBottom: '12px' }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Sin alertas pendientes</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>El sistema está funcionando correctamente</p>
                  </div>
                ) : (
                  <div>
                    {alerts.map(alert => {
                      const colors = getSeverityColor(alert.severity);
                      return (
                        <div
                          key={alert.id}
                          onClick={() => setSelectedAlert(alert)}
                          style={{
                            padding: '16px',
                            borderBottom: '1px solid #e2e8f0',
                            background: alert.resolved ? '#f8fafc' : colors.bg,
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              background: colors.border,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              flexShrink: 0,
                            }}>
                              {getAlertIcon(alert.type)}
                            </div>
                            
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 700, color: colors.text }}>
                                  {getAlertTypeName(alert.type)}
                                </span>
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  background: colors.border,
                                  color: 'white',
                                  textTransform: 'uppercase',
                                }}>
                                  {alert.severity}
                                </span>
                                {alert.resolved && (
                                  <span style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    background: '#22c55e',
                                    color: 'white',
                                  }}>
                                    RESUELTA
                                  </span>
                                )}
                              </div>
                              
                              <p style={{ margin: '4px 0', fontSize: '14px', color: '#475569' }}>
                                {alert.description}
                              </p>
                              
                              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <User style={{ width: 12, height: 12 }} />
                                  {alert.userId}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Calendar style={{ width: 12, height: 12 }} />
                                  {new Date(alert.timestamp).toLocaleString('es-CL')}
                                </span>
                              </div>
                            </div>

                            <Eye style={{ width: 20, height: 20, color: '#94a3b8' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Alert Detail Modal */}
            {selectedAlert && (
              <div 
                className="modal-overlay" 
                onClick={() => setSelectedAlert(null)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: '16px',
                }}
              >
                <div 
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '80vh',
                    overflow: 'auto',
                  }}
                >
                  <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #e2e8f0',
                    background: getSeverityColor(selectedAlert.severity).bg,
                  }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {getAlertIcon(selectedAlert.type)}
                      {getAlertTypeName(selectedAlert.type)}
                    </h3>
                  </div>
                  
                  <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Descripción</label>
                      <p style={{ margin: '4px 0 0 0', fontWeight: 500 }}>{selectedAlert.description}</p>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Usuario</label>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 500 }}>{selectedAlert.userId}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Tarea</label>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 500 }}>{selectedAlert.taskId}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Fecha</label>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 500 }}>
                          {new Date(selectedAlert.timestamp).toLocaleString('es-CL')}
                        </p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Severidad</label>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 500, textTransform: 'uppercase' }}>
                          {selectedAlert.severity}
                        </p>
                      </div>
                    </div>

                    {selectedAlert.resolved ? (
                      <div style={{
                        background: '#f0fdf4',
                        border: '1px solid #22c55e',
                        borderRadius: '8px',
                        padding: '12px',
                      }}>
                        <div style={{ fontWeight: 600, color: '#166534' }}>Alerta Resuelta</div>
                        <div style={{ fontSize: '13px', color: '#15803d' }}>
                          Por: {selectedAlert.resolvedBy} el {new Date(selectedAlert.resolvedAt!).toLocaleString('es-CL')}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleResolve(selectedAlert.id)}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: '#22c55e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '15px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <CheckCheck style={{ width: 20, height: 20 }} />
                        Marcar como Resuelta
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
