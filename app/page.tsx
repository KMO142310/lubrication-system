'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Target,
  AlertTriangle,
  Clock,
  ArrowRight,
  Droplets,
  ClipboardCheck,
  BarChart3,
  Play,
  Calendar,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { getCompletedTasksFromServer, isOnline } from '@/lib/sync';
import { calculateCompliance } from '@/lib/analytics';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    compliance: 0,
    todayTasks: 0,
    todayCompleted: 0,
  });

  const [todayTasksList, setTodayTasksList] = useState<Array<{
    id: string;
    code: string;
    description: string;
    status: string;
    lubricant: string;
  }>>([]);

  interface ServerTaskData {
    id: string;
    status: string;
    lubricationPointId?: string;
    completedAt?: string;
  }

  useEffect(() => {
    async function loadStats() {
      const todayWO = dataService.getTodayWorkOrder();

      if (!todayWO) {
        setStats({ compliance: 0, todayTasks: 0, todayCompleted: 0 });
        setTodayTasksList([]);
        return;
      }

      const todayTasks = dataService.getTasks(todayWO.id);
      const localCompleted = todayTasks.filter(t => t.status === 'completado').length;
      let serverCompletedCount = 0;
      const completedTaskIds = new Set<string>();

      try {
        if (isOnline()) {
          const serverTasks = await getCompletedTasksFromServer() as ServerTaskData[];
          if (serverTasks && serverTasks.length > 0) {
            const serverTodayCompleted = serverTasks.filter(st => {
              const isTodayTask = todayTasks.some(tt => tt.id === st.id);
              return isTodayTask && st.status === 'completado';
            });
            serverCompletedCount = serverTodayCompleted.length;
            serverTodayCompleted.forEach(t => completedTaskIds.add(t.id));
          }
        }
      } catch (error) {
        console.error("Error fetching server stats:", error);
      }

      const finalCompleted = Math.max(localCompleted, serverCompletedCount);
      const compliance = calculateCompliance(finalCompleted, todayTasks.length);

      setStats({ compliance, todayTasks: todayTasks.length, todayCompleted: finalCompleted });

      const points = dataService.getLubricationPoints();
      const components = dataService.getComponents();
      const machines = dataService.getMachines();
      const lubricants = dataService.getLubricants();

      const displayTasks = todayTasks.slice(0, 3).map(t => {
        const point = points.find(p => p.id === t.lubricationPointId);
        const component = point ? components.find(c => c.id === point.componentId) : null;
        const machine = component ? machines.find(m => m.id === component.machineId) : null;
        const lubricant = point ? lubricants.find(l => l.id === point.lubricantId) : null;

        return {
          id: t.id,
          code: point?.code || t.id.substring(0, 8),
          description: point ? `${component?.name || ''} - ${machine?.name || ''}` : 'Tarea',
          status: t.status === 'completado' || completedTaskIds.has(t.id) ? 'completado' : 'pendiente',
          lubricant: lubricant?.name || 'N/A'
        };
      });

      setTodayTasksList(displayTasks);
    }

    loadStats();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content page-wrapper">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
                  Panel de Control
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Resumen de operaciones y estado del sistema
                </p>
              </div>
              <div className="card-glass" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar style={{ width: 16, height: 16, color: 'var(--premium-blue)' }} />
                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                  {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
              <section>
                {/* Stats Grid */}
                <div className="stats-grid" style={{ marginBottom: '24px' }}>
                  {/* Compliance Card */}
                  <div className="stat-card">
                    <div className="stat-card-icon green">
                      <Target size={24} color="white" />
                    </div>
                    <div className="stat-value">{stats.compliance}</div>
                    <div className="stat-label">Cumplimiento %</div>
                    <div className="stat-trend up">
                      <Zap size={12} /> +2.4%
                    </div>
                  </div>

                  {/* Tasks Card */}
                  <div className="stat-card">
                    <div className="stat-card-icon blue">
                      <ClipboardCheck size={24} color="white" />
                    </div>
                    <div className="stat-value">{stats.todayTasks}</div>
                    <div className="stat-label">Tareas Hoy</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      {stats.todayCompleted} completadas →
                    </div>
                  </div>

                  {/* Anomalies Card */}
                  <div className="stat-card">
                    <div className="stat-card-icon warning">
                      <AlertTriangle size={24} color="white" />
                    </div>
                    <div className="stat-value">0</div>
                    <div className="stat-label">Anomalías</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Sin reportes activos →
                    </div>
                  </div>
                </div>

                {/* Today's Tasks */}
                <div className="card-glass" style={{ overflow: 'hidden' }}>
                  <div className="section-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Clock size={18} color="var(--premium-blue)" />
                      <span className="section-title">Actividad de Hoy</span>
                    </div>
                    <Link href="/tasks" className="section-link">
                      Ver todo <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div style={{ padding: '8px' }}>
                    {todayTasksList.length > 0 ? (
                      todayTasksList.map((task) => (
                        <div key={task.id} className="task-item">
                          <div className={`task-item-status ${task.status === 'completado' ? 'completed' : 'pending'}`}>
                            {task.status === 'completado' ? (
                              <CheckCircle2 size={20} />
                            ) : (
                              <Clock size={20} />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                              {task.description}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--led-warning)' }}>{task.code}</code>
                              <span>{task.lubricant}</span>
                            </div>
                          </div>
                          <span className={`badge-premium ${task.status === 'completado' ? 'success' : 'pending'}`}>
                            {task.status === 'completado' ? '✓ Completado' : 'Pendiente'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state" style={{ padding: '48px 24px' }}>
                        <div className="empty-state-icon">
                          <Clock size={32} />
                        </div>
                        <div className="empty-state-title">Sin tareas programadas</div>
                        <div className="empty-state-description">
                          Las tareas se generan automáticamente según el calendario de mantenimiento
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Sidebar */}
              <aside className="actions-grid">
                {/* Quick Actions */}
                <div className="card-glass" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                    Acciones Rápidas
                  </h3>

                  <div className="actions-grid">
                    <Link href="/tasks" className="action-card" style={{ textDecoration: 'none' }}>
                      <div className="action-card-icon" style={{ background: 'var(--gradient-warning)' }}>
                        <Play size={20} color="white" />
                      </div>
                      <div className="action-card-content">
                        <div className="action-card-title">Ejecutar Tareas</div>
                        <div className="action-card-subtitle">Lubricación diaria</div>
                      </div>
                    </Link>

                    <Link href="/anomalies" className="action-card" style={{ textDecoration: 'none' }}>
                      <div className="action-card-icon" style={{ background: 'var(--gradient-danger)' }}>
                        <AlertTriangle size={20} color="white" />
                      </div>
                      <div className="action-card-content">
                        <div className="action-card-title">Reportar Anomalía</div>
                        <div className="action-card-subtitle">Problemas detectados</div>
                      </div>
                    </Link>

                    <Link href="/metrics" className="action-card" style={{ textDecoration: 'none' }}>
                      <div className="action-card-icon" style={{ background: 'var(--gradient-primary)' }}>
                        <BarChart3 size={20} color="white" />
                      </div>
                      <div className="action-card-content">
                        <div className="action-card-title">Ver Métricas</div>
                        <div className="action-card-subtitle">Dashboard de control</div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Lubricants */}
                <div className="card-glass" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Droplets size={18} color="var(--premium-blue)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Lubricantes
                    </span>
                  </div>
                  <div className="lubricant-tags">
                    <span className="lubricant-tag grease">Grasa I y II</span>
                    <span className="lubricant-tag">KP2K</span>
                    <span className="lubricant-tag oil">Aceite 150</span>
                    <span className="lubricant-tag">NBU 15</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="card-glass" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--gradient-warning)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: 'white',
                      boxShadow: '0 0 20px rgba(210, 153, 34, 0.3)'
                    }}>
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {user?.name || 'Usuario'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {user?.role || 'Técnico'}
                      </div>
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
