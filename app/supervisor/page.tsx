'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  FileText,
  Calendar,
  Target,
  Activity,
  BarChart3,
  Download,
  ChevronRight,
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { generateWorkOrderPDF } from '@/lib/pdf';
import { getCompletedTasksFromServer } from '@/lib/sync';
import toast from 'react-hot-toast';

interface TechnicianStats {
  id: string;
  name: string;
  tasksCompleted: number;
  tasksTotal: number;
  compliance: number;
  lastActivity: string | null;
  status: 'activo' | 'inactivo' | 'atrasado';
}



export default function SupervisorDashboard() {
  const [loading, setLoading] = useState(true);
  const [technicianStats, setTechnicianStats] = useState<TechnicianStats[]>([]);
  const [globalStats, setGlobalStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueAnomalies: 0,
    compliance: 0,
    trend: 0,
  });
  const [recentCompletions, setRecentCompletions] = useState<Array<{
    taskCode: string;
    technician: string;
    completedAt: string;
    machine: string;
    hasPhoto: boolean;
  }>>([]);;

  const loadSupervisorData = useCallback(async () => {
    setLoading(true);

    // Cargar datos de Supabase
    const serverTasks = await getCompletedTasksFromServer();

    // Datos locales
    const _workOrders = dataService.getWorkOrders();
    const allTasks = dataService.getTasks();
    const anomalies = dataService.getAnomalies();
    const points = dataService.getLubricationPoints();
    const machines = dataService.getMachines();
    const components = dataService.getComponents();

    // Métricas globales de hoy
    const todayWO = dataService.getTodayWorkOrder();
    const todayTasks = todayWO ? allTasks.filter(t => t.workOrderId === todayWO.id) : [];

    // Merge con datos del servidor
    const mergedTasks = todayTasks.map(task => {
      const serverTask = serverTasks.find(st => st.id === task.id);
      return serverTask ? { ...task, ...serverTask } : task;
    });

    const completedToday = mergedTasks.filter(t => t.status === 'completado').length;
    const pendingToday = mergedTasks.filter(t => t.status === 'pendiente').length;

    // Calcular cumplimiento
    const compliance = mergedTasks.length > 0
      ? Math.round((completedToday / mergedTasks.length) * 100)
      : 0;

    // Tendencia (comparar con ayer - simulado)
    const trend = compliance > 80 ? 5 : compliance > 50 ? 0 : -10;

    setGlobalStats({
      totalTasks: mergedTasks.length,
      completedTasks: completedToday,
      pendingTasks: pendingToday,
      overdueAnomalies: anomalies.filter(a => a.status !== 'resuelta' && (a.severity === 'critica' || a.severity === 'alta')).length,
      compliance,
      trend,
    });

    // Simular estadísticas de técnicos (en producción vendría de la DB)
    const technicians: TechnicianStats[] = [
      {
        id: 'user-tech-1',
        name: 'Juan Pérez',
        tasksCompleted: completedToday,
        tasksTotal: mergedTasks.length,
        compliance: compliance,
        lastActivity: completedToday > 0 ? new Date().toISOString() : null,
        status: completedToday > 0 ? 'activo' : pendingToday > 0 ? 'atrasado' : 'inactivo',
      },
    ];
    setTechnicianStats(technicians);

    // Completaciones recientes (desde servidor)
    const recent = serverTasks
      .filter(t => t.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
      .slice(0, 5)
      .map(task => {
        const point = points.find(p => p.id === task.lubricationPointId);
        const comp = point ? components.find(c => c.id === point.componentId) : null;
        const machine = comp ? machines.find(m => m.id === comp.machineId) : null;

        return {
          taskCode: point?.code || task.id.slice(-6),
          technician: 'Juan Pérez', // En producción: buscar por completedBy
          completedAt: task.completedAt || '',
          machine: machine?.name || 'N/A',
          hasPhoto: !!task.photoUrl,
        };
      });
    setRecentCompletions(recent);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadSupervisorData();

    // Suscripción en tiempo real a cambios en tareas
    const channel = supabase
      .channel('supervisor-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tasks' },
        (payload) => {
          console.log('📡 NUEVA TAREA:', payload);
          toast.success('✅ Nueva tarea completada!', { duration: 3000 });
          loadSupervisorData();
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tasks' },
        (payload) => {
          console.log('📡 TAREA ACTUALIZADA:', payload);
          toast.success('🔄 Tarea actualizada', { duration: 2000 });
          loadSupervisorData();
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime status:', status);
      });

    // Auto-refresh cada 5 segundos (más frecuente)
    const interval = setInterval(() => {
      loadSupervisorData();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [loadSupervisorData]);

  const downloadDailyReport = () => {
    const workOrder = dataService.getTodayWorkOrder();
    if (!workOrder) {
      toast.error('No hay orden de trabajo para hoy');
      return;
    }

    const allTasks = dataService.getTasks(workOrder.id);
    const points = dataService.getLubricationPoints();
    const components = dataService.getComponents();
    const machines = dataService.getMachines();
    const lubricants = dataService.getLubricants();

    const pdfData = {
      code: `OT-${workOrder.scheduledDate.replace(/-/g, '')}`,
      date: new Date(workOrder.scheduledDate).toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      technician: 'Equipo Técnico',
      company: 'AISA - Aserraderos Industriales S.A.',
      plant: 'Planta Principal - Línea de Producción',
      shift: new Date().getHours() < 14 ? 'Turno Mañana (06:00 - 14:00)' : 'Turno Tarde (14:00 - 22:00)',
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === 'completado').length,
      tasks: allTasks.map(task => {
        const point = points.find(p => p.id === task.lubricationPointId);
        const comp = point ? components.find(c => c.id === point.componentId) : null;
        const machine = comp ? machines.find(m => m.id === comp.machineId) : null;
        const lub = point ? lubricants.find(l => l.id === point.lubricantId) : null;

        return {
          code: point?.code || 'N/A',
          machine: machine?.name || 'N/A',
          component: comp?.name || 'N/A',
          lubricant: lub?.name || 'N/A',
          method: point?.method || 'N/A',
          quantityUsed: task.quantityUsed ? `${task.quantityUsed} ${lub?.type === 'grasa' ? 'g' : 'ml'}` : '-',
          status: task.status,
          observations: task.observations || '',
          photoUrl: task.photoUrl,
          completedAt: task.completedAt ? new Date(task.completedAt).toLocaleString('es-CL') : undefined,
        };
      }),
      completedAt: new Date().toLocaleString('es-CL'),
    };

    generateWorkOrderPDF(pdfData);
    toast.success('Reporte descargado');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return '#22c55e';
      case 'atrasado': return '#f59e0b';
      case 'inactivo': return '#64748b';
      default: return '#64748b';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'activo': return 'EN LÍNEA';
      case 'atrasado': return 'ATRASADO';
      case 'inactivo': return 'SIN ACTIVIDAD';
      default: return status.toUpperCase();
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['desarrollador', 'supervisor']}>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
                <p style={{ color: '#94a3b8' }}>Cargando panel de supervisión...</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['desarrollador', 'supervisor']}>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">

            {/* Header Supervisor */}
            <header style={{
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
              borderRadius: '16px',
              padding: '24px 32px',
              marginBottom: '24px',
              border: '1px solid #334155',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Eye style={{ width: 24, height: 24, color: '#ffffff' }} />
                    </div>
                    <div>
                      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                        Panel de Supervisión
                      </h1>
                      <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                        Monitoreo en tiempo real del equipo técnico
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={loadSupervisorData}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#3b82f6',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Activity style={{ width: 18, height: 18 }} />
                    Actualizar
                  </button>
                  <button
                    onClick={downloadDailyReport}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Download style={{ width: 18, height: 18 }} />
                    Descargar Reporte
                  </button>
                </div>
              </div>
            </header>

            {/* KPIs del Supervisor */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '24px',
            }}>
              {/* Cumplimiento Global */}
              <div style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #334155',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: globalStats.compliance >= 80
                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                    : 'linear-gradient(90deg, #f59e0b, #d97706)',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Target style={{ width: 24, height: 24, color: globalStats.compliance >= 80 ? '#22c55e' : '#f59e0b' }} />
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: globalStats.trend >= 0 ? '#22c55e' : '#ef4444',
                  }}>
                    {globalStats.trend >= 0 ? <TrendingUp style={{ width: 14, height: 14 }} /> : <TrendingDown style={{ width: 14, height: 14 }} />}
                    {globalStats.trend}%
                  </span>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {globalStats.compliance}%
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Cumplimiento HOY
                </div>
              </div>

              {/* Tareas Completadas */}
              <div style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #334155',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                }} />
                <div style={{ marginBottom: '12px' }}>
                  <CheckCircle2 style={{ width: 24, height: 24, color: '#3b82f6' }} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {globalStats.completedTasks}<span style={{ fontSize: '18px', opacity: 0.5 }}>/{globalStats.totalTasks}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Tareas Completadas
                </div>
              </div>

              {/* Pendientes */}
              <div style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #334155',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                }} />
                <div style={{ marginBottom: '12px' }}>
                  <Clock style={{ width: 24, height: 24, color: '#f59e0b' }} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {globalStats.pendingTasks}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Tareas Pendientes
                </div>
              </div>

              {/* Anomalías Críticas */}
              <div style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #334155',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: globalStats.overdueAnomalies > 0
                    ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                    : 'linear-gradient(90deg, #22c55e, #16a34a)',
                }} />
                <div style={{ marginBottom: '12px' }}>
                  <AlertTriangle style={{ width: 24, height: 24, color: globalStats.overdueAnomalies > 0 ? '#ef4444' : '#22c55e' }} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {globalStats.overdueAnomalies}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Anomalías Urgentes
                </div>
              </div>
            </div>

            {/* Grid Principal */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 400px',
              gap: '24px',
            }}>
              {/* Panel de Técnicos */}
              <div style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '12px',
                border: '1px solid #334155',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Users style={{ width: 20, height: 20, color: '#3b82f6' }} />
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      Estado del Equipo Técnico
                    </h2>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Actualizado: {new Date().toLocaleTimeString('es-CL')}
                  </span>
                </div>

                <div>
                  {technicianStats.length > 0 ? technicianStats.map((tech, idx) => (
                    <div
                      key={tech.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto auto auto',
                        gap: '20px',
                        padding: '16px 24px',
                        borderBottom: idx < technicianStats.length - 1 ? '1px solid #1e293b' : 'none',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '16px',
                          color: '#0f172a',
                        }}>
                          {tech.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '14px' }}>{tech.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            {tech.lastActivity
                              ? `Última actividad: ${new Date(tech.lastActivity).toLocaleTimeString('es-CL')}`
                              : 'Sin actividad hoy'}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                          {tech.tasksCompleted}/{tech.tasksTotal}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Tareas</div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          color: tech.compliance >= 80 ? '#22c55e' : tech.compliance >= 50 ? '#f59e0b' : '#ef4444',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {tech.compliance}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Cumplimiento</div>
                      </div>

                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: getStatusColor(tech.status),
                        background: `${getStatusColor(tech.status)}20`,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        ● {getStatusLabel(tech.status)}
                      </span>
                    </div>
                  )) : (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <Users style={{ width: 48, height: 48, color: '#334155', margin: '0 auto 16px' }} />
                      <p style={{ color: '#64748b' }}>No hay técnicos asignados</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel Lateral */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Actividad Reciente */}
                <div style={{
                  background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <Activity style={{ width: 18, height: 18, color: '#22c55e' }} />
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      Actividad Reciente
                    </h3>
                  </div>

                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {recentCompletions.length > 0 ? recentCompletions.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px 20px',
                          borderBottom: idx < recentCompletions.length - 1 ? '1px solid #1e293b' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <code style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#22c55e',
                            fontFamily: 'var(--font-mono)',
                          }}>
                            ✓ {item.taskCode}
                          </code>
                          {item.hasPhoto && (
                            <span style={{ fontSize: '10px', color: '#3b82f6' }}>📷</span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.machine}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                          {item.technician} • {new Date(item.completedAt).toLocaleTimeString('es-CL')}
                        </div>
                      </div>
                    )) : (
                      <div style={{ padding: '24px', textAlign: 'center' }}>
                        <p style={{ color: '#64748b', fontSize: '13px' }}>Sin actividad reciente</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones Rápidas Supervisor */}
                <div style={{
                  background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '20px',
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '16px',
                  }}>
                    Acciones de Supervisor
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link href="/historial" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      textDecoration: 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText style={{ width: 18, height: 18, color: '#3b82f6' }} />
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff' }}>Ver Historial</span>
                      </div>
                      <ChevronRight style={{ width: 16, height: 16, color: '#64748b' }} />
                    </Link>

                    <Link href="/metrics" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      textDecoration: 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BarChart3 style={{ width: 18, height: 18, color: '#8b5cf6' }} />
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff' }}>Métricas Detalladas</span>
                      </div>
                      <ChevronRight style={{ width: 16, height: 16, color: '#64748b' }} />
                    </Link>

                    <Link href="/anomalies" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      textDecoration: 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertTriangle style={{ width: 18, height: 18, color: '#ef4444' }} />
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff' }}>Revisar Anomalías</span>
                      </div>
                      <ChevronRight style={{ width: 16, height: 16, color: '#64748b' }} />
                    </Link>

                    <Link href="/schedule" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      textDecoration: 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar style={{ width: 18, height: 18, color: '#f59e0b' }} />
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff' }}>Planificación</span>
                      </div>
                      <ChevronRight style={{ width: 16, height: 16, color: '#64748b' }} />
                    </Link>
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
