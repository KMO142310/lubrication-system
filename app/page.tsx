'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  Droplets,
  Cog,
  ClipboardCheck,
  Calendar,
  BarChart3,
  Building2,
  Play,
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { useAuth } from '@/lib/auth';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    compliance: 0,
    completedOrders: 0,
    totalOrders: 0,
    openAnomalies: 0,
    criticalAnomalies: 0,
    todayTasks: 0,
    todayCompleted: 0,
    totalPoints: 0,
    totalMachines: 0,
  });

  const [todayTasksList, setTodayTasksList] = useState<Array<{
    id: string;
    code: string;
    component: string;
    machine: string;
    frequency: string;
    status: string;
    lubricant: string;
  }>>([]);

  useEffect(() => {
    const workOrders = dataService.getWorkOrders();
    const allTasks = dataService.getTasks();
    const anomalies = dataService.getAnomalies();
    const points = dataService.getLubricationPoints();
    const machines = dataService.getMachines();
    const components = dataService.getComponents();
    const lubricants = dataService.getLubricants();
    const frequencies = dataService.getFrequencies();

    const completedWOs = workOrders.filter(wo => wo.status === 'completado');
    const totalWOs = workOrders.filter(wo => new Date(wo.scheduledDate) <= new Date());

    const todayWO = dataService.getTodayWorkOrder();
    const todayTasks = todayWO ? allTasks.filter(t => t.workOrderId === todayWO.id) : [];
    const todayCompleted = todayTasks.filter(t => t.status === 'completado').length;

    // Cumplimiento SLA: solo cuenta las tareas de HOY
    // Si no hay tareas = 0% (no inventar datos)
    const compliance = todayTasks.length > 0
      ? Math.round((todayCompleted / todayTasks.length) * 100)
      : 0;

    setStats({
      compliance,
      completedOrders: completedWOs.length,
      totalOrders: totalWOs.length,
      openAnomalies: anomalies.filter(a => a.status !== 'resuelta').length,
      criticalAnomalies: anomalies.filter(a => a.severity === 'critica' || a.severity === 'alta').length,
      todayTasks: todayTasks.length,
      todayCompleted,
      totalPoints: points.length,
      totalMachines: machines.length,
    });

    // Build today's tasks list with full info
    const tasksList = todayTasks.slice(0, 6).map(task => {
      const point = points.find(p => p.id === task.lubricationPointId);
      const comp = point ? components.find(c => c.id === point.componentId) : null;
      const machine = comp ? machines.find(m => m.id === comp.machineId) : null;
      const lub = point ? lubricants.find(l => l.id === point.lubricantId) : null;
      const freq = point ? frequencies.find(f => f.id === point.frequencyId) : null;

      return {
        id: task.id,
        code: point?.code || 'N/A',
        component: comp?.name || 'N/A',
        machine: machine?.name || 'N/A',
        frequency: freq?.name || 'N/A',
        status: task.status,
        lubricant: lub?.name || 'N/A',
      };
    });

    setTodayTasksList(tasksList);
  }, []);

  const todayProgress = stats.todayTasks > 0
    ? Math.round((stats.todayCompleted / stats.todayTasks) * 100)
    : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container dashboard-container">
            
            {/* Industrial Header Bar */}
            <header className="dashboard-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '20px',
                    color: '#0f172a',
                    letterSpacing: '-1px',
                  }}>
                    A
                  </div>
                  <div>
                    <h1 style={{ 
                      fontSize: '28px', 
                      fontWeight: 800, 
                      color: '#ffffff',
                      letterSpacing: '-0.5px',
                      margin: 0,
                    }}>
                      AISA LUBRICACIÓN
                    </h1>
                    <p style={{ 
                      fontSize: '13px', 
                      color: '#94a3b8',
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                    }}>
                      Sistema de Gestión Industrial
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {new Date().toLocaleDateString('es-CL', { weekday: 'long' })}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  ● OPERATIVO
                </div>
              </div>
            </header>

            {/* Industrial KPI Cards - CLICKEABLES */}
            <section className="dashboard-content">
              <div className="kpi-grid">
                {/* Compliance KPI → Métricas */}
                <Link href="/metrics" style={{ textDecoration: 'none' }}>
                  <div className="kpi-clickable" style={{
                    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #334155',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: stats.compliance >= 80 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #f59e0b, #d97706)',
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        background: stats.compliance >= 80 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Target style={{ width: 22, height: 22, color: stats.compliance >= 80 ? '#22c55e' : '#f59e0b' }} />
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: stats.compliance >= 80 ? '#22c55e' : '#f59e0b',
                        background: stats.compliance >= 80 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        {stats.compliance >= 80 ? '● OK' : '● BAJO'}
                      </span>
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                      {stats.compliance}<span style={{ fontSize: '20px', opacity: 0.6 }}>%</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Cumplimiento SLA
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Ver métricas <ArrowRight style={{ width: 12, height: 12 }} />
                    </div>
                  </div>
                </Link>

                {/* Today Tasks KPI → Tareas */}
                <Link href="/tasks" style={{ textDecoration: 'none' }}>
                  <div className="kpi-clickable" style={{
                    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #334155',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <CheckCircle2 style={{ width: 22, height: 22, color: '#3b82f6' }} />
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#3b82f6',
                        background: 'rgba(59, 130, 246, 0.15)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                      }}>
                        <TrendingUp style={{ width: 12, height: 12, display: 'inline', marginRight: '4px' }} />
                        {todayProgress}%
                      </span>
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                      {stats.todayCompleted}<span style={{ fontSize: '20px', opacity: 0.6 }}>/{stats.todayTasks}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Tareas Hoy
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Ir a tareas <ArrowRight style={{ width: 12, height: 12 }} />
                    </div>
                  </div>
                </Link>

                {/* Anomalies KPI → Anomalías */}
                <Link href="/anomalies" style={{ textDecoration: 'none' }}>
                  <div className="kpi-clickable" style={{
                    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #334155',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: stats.openAnomalies > 0 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #22c55e, #16a34a)',
                    }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      background: stats.openAnomalies > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <AlertTriangle style={{ width: 22, height: 22, color: stats.openAnomalies > 0 ? '#ef4444' : '#22c55e' }} />
                    </div>
                    {stats.criticalAnomalies > 0 && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.15)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                      }}>
                        ⚠ {stats.criticalAnomalies} CRÍTICAS
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                    {stats.openAnomalies}
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Anomalías Abiertas
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Ver anomalías <ArrowRight style={{ width: 12, height: 12 }} />
                  </div>
                  </div>
                </Link>

                {/* Equipment KPI → Activos */}
                <Link href="/assets" style={{ textDecoration: 'none' }}>
                  <div className="kpi-clickable" style={{
                    background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #334155',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        background: 'rgba(139, 92, 246, 0.15)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Cog style={{ width: 22, height: 22, color: '#8b5cf6' }} />
                      </div>
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                      {stats.totalMachines}
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Equipos Activos
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {stats.totalPoints} puntos <ArrowRight style={{ width: 12, height: 12 }} />
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* Main Content Grid */}
            <div className="main-grid">
              {/* Today's Tasks */}
              <section>
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
                    <div>
                      <h2 style={{ 
                        fontSize: '18px', 
                        fontWeight: 700, 
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        margin: 0,
                      }}>
                        <ClipboardCheck style={{ width: 20, height: 20, color: '#f59e0b' }} />
                        TAREAS DE LUBRICACIÓN
                      </h2>
                      <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        Programa diario según Plan Detallado Cap. 9
                      </p>
                    </div>
                    <Link href="/tasks" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: '8px',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Ver Todas
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </Link>
                  </div>

                  <div>
                    {todayTasksList.length > 0 ? (
                      <div>
                        {todayTasksList.map((task, idx) => (
                          <div
                            key={task.id}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '90px 1fr auto',
                              gap: '16px',
                              padding: '16px 24px',
                              borderBottom: idx < todayTasksList.length - 1 ? '1px solid #1e293b' : 'none',
                              alignItems: 'center',
                              background: idx % 2 === 0 ? 'transparent' : 'rgba(15, 23, 42, 0.3)',
                            }}
                          >
                            <code style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '14px',
                              fontWeight: 700,
                              color: '#f59e0b',
                              background: 'rgba(245, 158, 11, 0.1)',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1px solid rgba(245, 158, 11, 0.2)',
                            }}>
                              {task.code}
                            </code>
                            <div>
                              <div style={{ fontWeight: 600, color: '#ffffff', marginBottom: '2px', fontSize: '14px' }}>
                                {task.component}
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>
                                {task.machine} • {task.lubricant}
                              </div>
                            </div>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: task.status === 'completado' ? '#22c55e' : '#f59e0b',
                              background: task.status === 'completado' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}>
                              {task.status === 'completado' ? '✓ COMPLETADO' : '● PENDIENTE'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        padding: '48px',
                        textAlign: 'center',
                      }}>
                        <Clock style={{ width: 48, height: 48, margin: '0 auto 16px', color: '#334155' }} />
                        <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Sin tareas programadas</p>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>Las tareas se generan automáticamente</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Sidebar */}
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Quick Actions */}
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
                    Acciones Rápidas
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link href="/tasks" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Play style={{ width: 18, height: 18, color: '#0f172a' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>Ejecutar Tareas</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Lubricación diaria</div>
                      </div>
                    </Link>

                    <Link href="/anomalies" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <AlertTriangle style={{ width: 18, height: 18, color: '#ef4444' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>Reportar Anomalía</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Problemas detectados</div>
                      </div>
                    </Link>

                    <Link href="/metrics" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <BarChart3 style={{ width: 18, height: 18, color: '#3b82f6' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>Ver Indicadores</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>KPIs y métricas</div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Lubricants Info */}
                <div style={{
                  background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Droplets style={{ width: 18, height: 18, color: '#3b82f6' }} />
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Lubricantes
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#22c55e', background: 'rgba(34, 197, 94, 0.15)', padding: '6px 12px', borderRadius: '20px' }}>Grasa I y II</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6', background: 'rgba(59, 130, 246, 0.15)', padding: '6px 12px', borderRadius: '20px' }}>KP2K</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.15)', padding: '6px 12px', borderRadius: '20px' }}>Aceite 150</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '6px 12px', borderRadius: '20px' }}>NBU 15</span>
                  </div>
                </div>

                {/* User Info */}
                <div style={{
                  background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '18px',
                      color: '#0f172a',
                    }}>
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>{user?.name || 'Usuario'}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>{user?.role || 'Técnico'}</div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
