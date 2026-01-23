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

    const completedTasks = allTasks.filter(t => t.status === 'completado');
    const dueTasks = allTasks.filter(t => {
      const wo = workOrders.find(w => w.id === t.workOrderId);
      return wo && new Date(wo.scheduledDate) <= new Date();
    });

    const compliance = dueTasks.length > 0
      ? Math.round((completedTasks.length / dueTasks.length) * 100)
      : 100;

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
          <div className="page-container">
            {/* Hero Header */}
            <header style={{
              background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-900) 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              marginBottom: 'var(--space-8)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: 'var(--text-sm)', opacity: 0.8, marginBottom: 'var(--space-2)' }}>
                  {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'Usuario'}
                </h1>
                <p style={{ fontSize: 'var(--text-base)', opacity: 0.9 }}>
                  Sistema de Gestión de Lubricación Industrial — Aserradero AISA
                </p>

                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                  <Link href="/tasks" className="btn" style={{
                    background: 'white',
                    color: 'var(--primary-800)',
                    fontWeight: 600,
                  }}>
                    <Play style={{ width: 16, height: 16 }} />
                    Iniciar Tareas del Día
                  </Link>
                  <Link href="/schedule" className="btn" style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}>
                    <Calendar style={{ width: 16, height: 16 }} />
                    Ver Planificación
                  </Link>
                </div>
              </div>

              {/* Background decoration */}
              <div style={{
                position: 'absolute',
                right: -50,
                top: -50,
                width: 300,
                height: 300,
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
              }} />
            </header>

            {/* Stats Cards */}
            <section style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--space-4)',
              }}>
                {/* Compliance */}
                <article className="stat-card" style={{ borderLeft: '4px solid var(--accent-500)' }}>
                  <div className="stat-header">
                    <div className="stat-icon primary">
                      <Target style={{ width: 24, height: 24 }} />
                    </div>
                    <span className={`stat-trend ${stats.compliance >= 90 ? 'up' : 'down'}`}>
                      {stats.compliance >= 90 ? 'Meta cumplida' : 'Por mejorar'}
                    </span>
                  </div>
                  <div>
                    <span className="stat-value">{stats.compliance}%</span>
                    <span className="stat-label">Cumplimiento SLA</span>
                  </div>
                </article>

                {/* Today Progress */}
                <article className="stat-card" style={{ borderLeft: '4px solid var(--success-500)' }}>
                  <div className="stat-header">
                    <div className="stat-icon success">
                      <CheckCircle2 style={{ width: 24, height: 24 }} />
                    </div>
                    <span className="stat-trend up">
                      <TrendingUp style={{ width: 12, height: 12 }} />
                      {todayProgress}%
                    </span>
                  </div>
                  <div>
                    <span className="stat-value">{stats.todayCompleted}/{stats.todayTasks}</span>
                    <span className="stat-label">Tareas Hoy</span>
                  </div>
                </article>

                {/* Anomalies */}
                <article className="stat-card" style={{ borderLeft: `4px solid ${stats.openAnomalies > 0 ? 'var(--warning-500)' : 'var(--success-500)'}` }}>
                  <div className="stat-header">
                    <div className={`stat-icon ${stats.openAnomalies > 0 ? 'warning' : 'success'}`}>
                      <AlertTriangle style={{ width: 24, height: 24 }} />
                    </div>
                    {stats.criticalAnomalies > 0 && (
                      <span className="stat-trend down">{stats.criticalAnomalies} urgentes</span>
                    )}
                  </div>
                  <div>
                    <span className="stat-value">{stats.openAnomalies}</span>
                    <span className="stat-label">Anomalías Abiertas</span>
                  </div>
                </article>

                {/* Assets */}
                <article className="stat-card" style={{ borderLeft: '4px solid var(--primary-500)' }}>
                  <div className="stat-header">
                    <div className="stat-icon primary">
                      <Cog style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <div>
                    <span className="stat-value">{stats.totalMachines}</span>
                    <span className="stat-label">Equipos Activos</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                    {stats.totalPoints} puntos de lubricación
                  </div>
                </article>
              </div>
            </section>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
              {/* Today's Tasks */}
              <section>
                <div className="card">
                  <div className="card-header">
                    <div>
                      <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <ClipboardCheck style={{ width: 18, height: 18, color: 'var(--accent-500)' }} />
                        Tareas de Lubricación — Hoy
                      </h2>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                        Programa de lubricación diario según Plan Detallado Cap. 9
                      </p>
                    </div>
                    <Link href="/tasks" className="btn btn-primary btn-sm">
                      Ver Todas
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </Link>
                  </div>

                  <div className="card-body" style={{ padding: 0 }}>
                    {todayTasksList.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {todayTasksList.map((task, idx) => (
                          <div
                            key={task.id}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '80px 1fr auto',
                              gap: 'var(--space-4)',
                              padding: 'var(--space-4) var(--space-5)',
                              borderBottom: idx < todayTasksList.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                              alignItems: 'center',
                            }}
                          >
                            <code style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 600,
                              color: 'var(--primary-700)',
                              background: 'var(--primary-50)',
                              padding: 'var(--space-1) var(--space-2)',
                              borderRadius: 'var(--radius-sm)',
                            }}>
                              {task.code}
                            </code>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                                {task.component}
                              </div>
                              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                {task.machine} • {task.lubricant}
                              </div>
                            </div>
                            <span className={`badge ${task.status === 'completado' ? 'badge-success' : 'badge-warning'}`}>
                              {task.status === 'completado' ? 'Completado' : 'Pendiente'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        padding: 'var(--space-12)',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                      }}>
                        <Clock style={{ width: 48, height: 48, margin: '0 auto var(--space-4)', opacity: 0.3 }} />
                        <p style={{ fontWeight: 500, marginBottom: 'var(--space-2)' }}>No hay tareas programadas para hoy</p>
                        <p style={{ fontSize: 'var(--text-sm)' }}>Las tareas se generan automáticamente según el programa de lubricación</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Sidebar */}
              <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Quick Navigation */}
                <nav className="card">
                  <div className="card-header">
                    <h3 className="card-title">Navegación Rápida</h3>
                  </div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <Link href="/tasks" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      transition: 'background var(--duration-fast)',
                    }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--accent-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <ClipboardCheck style={{ width: 18, height: 18, color: 'var(--accent-600)' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Ejecutar Tareas</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Lubricación diaria</div>
                      </div>
                    </Link>

                    <Link href="/anomalies" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                    }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--warning-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <AlertTriangle style={{ width: 18, height: 18, color: 'var(--warning-600)' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Reportar Anomalía</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Problemas detectados</div>
                      </div>
                    </Link>

                    <Link href="/metrics" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                    }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--primary-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <BarChart3 style={{ width: 18, height: 18, color: 'var(--primary-600)' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Ver Indicadores</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>KPIs y métricas</div>
                      </div>
                    </Link>

                    <Link href="/assets" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                    }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--slate-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Building2 style={{ width: 18, height: 18, color: 'var(--slate-600)' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Gestionar Activos</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Equipos y puntos</div>
                      </div>
                    </Link>
                  </div>
                </nav>

                {/* System Info */}
                <div className="card" style={{ background: 'var(--slate-50)' }}>
                  <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <Droplets style={{ width: 20, height: 20, color: 'var(--primary-600)' }} />
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Lubricantes en Uso</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <span className="badge badge-primary">Grasa I y II</span>
                      <span className="badge badge-primary">KP2K</span>
                      <span className="badge badge-primary">Aceite 150</span>
                      <span className="badge badge-primary">NBU 15</span>
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
