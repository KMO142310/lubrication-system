'use client';
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Droplets,
  Calendar,
  User,
  Building2,
  X
} from 'lucide-react';

interface TaskSummary {
  id: string;
  code: string;
  component: string;
  machine: string;
  lubricant: string;
  method: string;
  quantityUsed?: number; // Lo que realmente se usó
  unit: string;
  status: 'completado' | 'pendiente' | 'omitido';
  completedAt?: string;
  observations?: string;
}

interface DailyReportProps {
  date: string;
  technician: string;
  tasks: TaskSummary[];
  onClose: () => void;
  onDownload?: () => void;
}

export default function DailyReport({ date, technician, tasks, onClose, onDownload }: DailyReportProps) {
  const completed = tasks.filter(t => t.status === 'completado');
  const pending = tasks.filter(t => t.status === 'pendiente');
  const skipped = tasks.filter(t => t.status === 'omitido');

  const totalLubricant = completed.reduce((acc, t) => {
    return acc + (t.quantityUsed || 0);
  }, 0);

  const compliance = tasks.length > 0
    ? Math.round((completed.length / tasks.length) * 100)
    : 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal daily-report-modal" onClick={e => e.stopPropagation()} style={{
        maxWidth: '700px',
        width: '95vw',
        maxHeight: '90vh',
        overflow: 'auto',
        margin: '16px'
      }}>
        {/* Header */}
        <div className="modal-header" style={{
          background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-900) 100%)',
          color: 'white',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                INFORME DE LUBRICACIÓN
              </h2>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.8 }}>
                Resumen del día
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Info Bar - Responsive */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1px',
          background: 'var(--border)',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{
            padding: '12px 16px',
            background: 'var(--slate-50)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Calendar style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fecha</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{formatDate(date)}</div>
            </div>
          </div>
          <div style={{
            padding: '12px 16px',
            background: 'var(--slate-50)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <User style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Técnico</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{technician}</div>
            </div>
          </div>
          <div style={{
            padding: '12px 16px',
            background: 'var(--slate-50)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Building2 style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Planta</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>AISA</div>
            </div>
          </div>
        </div>

        {/* KPIs - Responsive 2x2 en móvil */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
          gap: '8px',
          padding: '12px'
        }}>
          <div style={{
            background: 'var(--success-100)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <CheckCircle2 style={{ width: 20, height: 20, color: 'var(--success-600)', margin: '0 auto 4px' }} />
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success-600)' }}>
              {completed.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--success-600)', textTransform: 'uppercase' }}>
              Completadas
            </div>
          </div>

          <div style={{
            background: 'var(--warning-100)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <Clock style={{ width: 20, height: 20, color: 'var(--warning-600)', margin: '0 auto 4px' }} />
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning-600)' }}>
              {pending.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--warning-600)', textTransform: 'uppercase' }}>
              Pendientes
            </div>
          </div>

          <div style={{
            background: 'var(--accent-100)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <AlertTriangle style={{ width: 20, height: 20, color: 'var(--accent-600)', margin: '0 auto 4px' }} />
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-600)' }}>
              {skipped.length}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--accent-600)', textTransform: 'uppercase' }}>
              Omitidas
            </div>
          </div>

          <div style={{
            background: compliance >= 80 ? 'var(--success-100)' : 'var(--warning-100)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <Droplets style={{
              width: 20,
              height: 20,
              color: compliance >= 80 ? 'var(--success-600)' : 'var(--warning-600)',
              margin: '0 auto 4px'
            }} />
            <div style={{
              fontSize: '24px',
              fontWeight: 700,
              color: compliance >= 80 ? 'var(--success-600)' : 'var(--warning-600)'
            }}>
              {compliance}%
            </div>
            <div style={{
              fontSize: '11px',
              color: compliance >= 80 ? 'var(--success-600)' : 'var(--warning-600)',
              textTransform: 'uppercase'
            }}>
              Cumplimiento
            </div>
          </div>
        </div>

        {/* Task List */}
        <div style={{ padding: '0 16px 16px' }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px'
          }}>
            Detalle de Tareas ({tasks.length})
          </h3>

          <div style={{
            maxHeight: '250px',
            overflowY: 'auto',
            border: '1px solid var(--border)',
            borderRadius: '8px'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'var(--slate-50)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Código</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Componente</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Lubricante</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Cant.</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Estado</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Hora</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => (
                  <tr key={task.id} style={{
                    background: idx % 2 === 0 ? 'white' : 'var(--slate-50)',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <td style={{ padding: '8px 12px' }}>
                      <code style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        background: 'var(--slate-100)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {task.code}
                      </code>
                    </td>
                    <td style={{ padding: '8px 12px' }}>{task.component}</td>
                    <td style={{ padding: '8px 12px' }}>{task.lubricant}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      {task.quantityUsed || '-'} {task.quantityUsed ? task.unit : ''}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background: task.status === 'completado' ? 'var(--success-100)' :
                          task.status === 'omitido' ? 'var(--accent-100)' : 'var(--warning-100)',
                        color: task.status === 'completado' ? 'var(--success-600)' :
                          task.status === 'omitido' ? 'var(--accent-600)' : 'var(--warning-600)'
                      }}>
                        {task.status === 'completado' ? '✓' : task.status === 'omitido' ? '✕' : '○'} {task.status}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      {formatTime(task.completedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Consumo Total */}
        <div style={{
          padding: '12px 16px',
          background: 'var(--slate-50)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Consumo total de lubricante:
          </span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary-700)' }}>
            {totalLubricant.toLocaleString()} unidades
          </span>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Generado: {new Date().toLocaleString('es-CL')}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            {onDownload && (
              <button className="btn btn-primary" onClick={onDownload}>
                <Download style={{ width: 14, height: 14 }} />
                Descargar PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
