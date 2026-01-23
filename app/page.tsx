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
  ArrowUpRight,
  Droplets,
  Wrench,
  ClipboardCheck,
} from 'lucide-react';
import { dataService } from '@/lib/data';

export default function Dashboard() {
  const [stats, setStats] = useState({
    compliance: 0,
    completedOrders: 0,
    totalOrders: 0,
    openAnomalies: 0,
    criticalAnomalies: 0,
    todayTasks: 0,
    todayCompleted: 0,
    totalPoints: 0,
  });

  const [recentTasks, setRecentTasks] = useState<Array<{
    id: string;
    code: string;
    machine: string;
    status: string;
    time: string;
  }>>([]);

  useEffect(() => {
    // Calculate stats
    const workOrders = dataService.getWorkOrders();
    const allTasks = dataService.getTasks();
    const anomalies = dataService.getAnomalies();
    const points = dataService.getLubricationPoints();

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
    });

    // Get recent tasks for activity feed
    const machines = dataService.getMachines();
    const components = dataService.getComponents();
    const lubPoints = dataService.getLubricationPoints();

    const recent = todayTasks.slice(0, 5).map(task => {
      const point = lubPoints.find(p => p.id === task.lubricationPointId);
      const comp = point ? components.find(c => c.id === point.componentId) : null;
      const machine = comp ? machines.find(m => m.id === comp.machineId) : null;

      return {
        id: task.id,
        code: point?.code || '',
        machine: machine?.name || '',
        status: task.status,
        time: task.completedAt
          ? new Date(task.completedAt).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
          : '-',
      };
    });

    setRecentTasks(recent);
  }, []);

  const todayProgress = stats.todayTasks > 0
    ? Math.round((stats.todayCompleted / stats.todayTasks) * 100)
    : 0;

  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            {/* Page Header */}
            <header className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title">Dashboard</h1>
                  <p className="page-subtitle">
                    {new Date().toLocaleDateString('es-CL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="page-actions">
                  <Link href="/tasks" className="btn btn-primary">
                    <ClipboardCheck style={{ width: 16, height: 16 }} />
                    Ver Tareas de Hoy
                  </Link>
                </div>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="dashboard-grid">
              {/* Compliance Card */}
              <div className="col-span-3">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon primary">
                      <Target style={{ width: 24, height: 24 }} />
                    </div>
                    <span className={`stat-trend ${stats.compliance >= 90 ? 'up' : stats.compliance >= 70 ? 'neutral' : 'down'}`}>
                      {stats.compliance >= 90 ? 'Excelente' : stats.compliance >= 70 ? 'Aceptable' : 'Bajo'}
                    </span>
                  </div>
                  <div>
                    <span className="stat-value">{stats.compliance}%</span>
                    <span className="stat-label">Cumplimiento del Plan</span>
                  </div>
                </div>
              </div>

              {/* Completed Orders */}
              <div className="col-span-3">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon success">
                      <CheckCircle2 style={{ width: 24, height: 24 }} />
                    </div>
                    <span className="stat-trend up">
                      <TrendingUp style={{ width: 12, height: 12 }} />
                      {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 100}%
                    </span>
                  </div>
                  <div>
                    <span className="stat-value">{stats.completedOrders}</span>
                    <span className="stat-label">Órdenes Completadas</span>
                  </div>
                </div>
              </div>

              {/* Anomalies */}
              <div className="col-span-3">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon warning">
                      <AlertTriangle style={{ width: 24, height: 24 }} />
                    </div>
                    {stats.criticalAnomalies > 0 && (
                      <span className="stat-trend down">
                        {stats.criticalAnomalies} críticas
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="stat-value">{stats.openAnomalies}</span>
                    <span className="stat-label">Anomalías Abiertas</span>
                  </div>
                </div>
              </div>

              {/* Total Points */}
              <div className="col-span-3">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon accent">
                      <Droplets style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <div>
                    <span className="stat-value">{stats.totalPoints}</span>
                    <span className="stat-label">Puntos de Lubricación</span>
                  </div>
                </div>
              </div>

              {/* Today's Progress */}
              <div className="col-span-8">
                <div className="progress-container">
                  <div className="progress-header">
                    <div>
                      <span className="progress-title">Progreso de Hoy</span>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                        Tareas de lubricación completadas
                      </p>
                    </div>
                    <span className="progress-value">{stats.todayCompleted}/{stats.todayTasks}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${todayProgress}%` }} />
                  </div>
                  <div className="progress-labels">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="col-span-4">
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Acciones Rápidas</span>
                  </div>
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <Link href="/tasks" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Clock style={{ width: 16, height: 16 }} />
                        Tareas Pendientes
                      </span>
                      <ArrowUpRight style={{ width: 16, height: 16 }} />
                    </Link>
                    <Link href="/anomalies" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <AlertTriangle style={{ width: 16, height: 16 }} />
                        Reportar Anomalía
                      </span>
                      <ArrowUpRight style={{ width: 16, height: 16 }} />
                    </Link>
                    <Link href="/assets" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Wrench style={{ width: 16, height: 16 }} />
                        Ver Equipos
                      </span>
                      <ArrowUpRight style={{ width: 16, height: 16 }} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="col-span-12">
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Actividad Reciente</span>
                    <Link href="/tasks" className="btn btn-ghost btn-sm">
                      Ver todo
                      <ArrowUpRight style={{ width: 14, height: 14 }} />
                    </Link>
                  </div>
                  <div className="data-table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Máquina</th>
                          <th>Estado</th>
                          <th>Hora</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTasks.map(task => (
                          <tr key={task.id}>
                            <td>
                              <span className="cell-mono">{task.code}</span>
                            </td>
                            <td className="cell-primary">{task.machine}</td>
                            <td>
                              <span className={`badge ${task.status === 'completado' ? 'badge-success' : 'badge-warning'}`}>
                                {task.status === 'completado' ? 'Completado' : 'Pendiente'}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-muted)' }}>{task.time}</td>
                          </tr>
                        ))}
                        {recentTasks.length === 0 && (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                              No hay tareas programadas para hoy
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
