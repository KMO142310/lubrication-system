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
  TrendingDown,
  Droplets,
  BarChart3,
  Building2,
  FileCheck,
  Clock,
} from 'lucide-react';
import { dataService } from '@/lib/data';

interface MetricData {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  iconType: 'primary' | 'success' | 'warning' | 'accent';
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; completed: number; total: number }[]>([]);

  useEffect(() => {
    const workOrders = dataService.getWorkOrders();
    const allTasks = dataService.getTasks();
    const anomalies = dataService.getAnomalies();
    const lubricationPoints = dataService.getLubricationPoints();
    const lubricants = dataService.getLubricants();

    const completedWOs = workOrders.filter(wo => wo.status === 'completado');
    const totalWOs = workOrders.filter(wo => new Date(wo.scheduledDate) <= new Date());

    const completedTasks = allTasks.filter(t => t.status === 'completado');
    const dueTasks = allTasks.filter(t => {
      const wo = workOrders.find(w => w.id === t.workOrderId);
      return wo && new Date(wo.scheduledDate) <= new Date();
    });

    const compliance = dueTasks.length > 0
      ? Math.round((completedTasks.length / dueTasks.length) * 100)
      : 100;

    const openAnomalies = anomalies.filter(a => a.status !== 'resuelta');
    const criticalAnomalies = anomalies.filter(a => a.severity === 'critica' || a.severity === 'alta');

    const totalConsumption = completedTasks.reduce((acc, task) => acc + (task.quantityUsed || 0), 0);

    setMetrics([
      {
        title: 'Cumplimiento del Plan',
        value: `${compliance}%`,
        subtitle: `${completedTasks.length} de ${dueTasks.length} tareas`,
        icon: <Target style={{ width: 24, height: 24 }} />,
        trend: compliance >= 90 ? 'up' : compliance >= 70 ? 'neutral' : 'down',
        trendValue: compliance >= 90 ? 'Excelente' : compliance >= 70 ? 'Aceptable' : 'Bajo',
        iconType: 'primary',
      },
      {
        title: 'Órdenes Completadas',
        value: completedWOs.length,
        subtitle: `de ${totalWOs.length} programadas`,
        icon: <CheckCircle2 style={{ width: 24, height: 24 }} />,
        trend: 'up',
        trendValue: totalWOs.length > 0 ? `${Math.round((completedWOs.length / totalWOs.length) * 100)}%` : '100%',
        iconType: 'success',
      },
      {
        title: 'Anomalías Abiertas',
        value: openAnomalies.length,
        subtitle: `${criticalAnomalies.length} críticas/altas`,
        icon: <AlertTriangle style={{ width: 24, height: 24 }} />,
        trend: openAnomalies.length === 0 ? 'up' : openAnomalies.length <= 2 ? 'neutral' : 'down',
        trendValue: openAnomalies.length === 0 ? 'Sin pendientes' : `${criticalAnomalies.length} urgentes`,
        iconType: 'warning',
      },
      {
        title: 'Consumo Total',
        value: `${(totalConsumption / 1000).toFixed(1)} L`,
        subtitle: 'Lubricantes aplicados',
        icon: <Droplets style={{ width: 24, height: 24 }} />,
        trend: 'neutral',
        iconType: 'accent',
      },
      {
        title: 'Puntos de Lubricación',
        value: lubricationPoints.length,
        subtitle: 'Activos registrados',
        icon: <BarChart3 style={{ width: 24, height: 24 }} />,
        iconType: 'primary',
      },
      {
        title: 'Lubricantes en Uso',
        value: lubricants.length,
        subtitle: 'Tipos diferentes',
        icon: <TrendingUp style={{ width: 24, height: 24 }} />,
        iconType: 'success',
      },
    ]);

    // Weekly data
    const last7Days: typeof weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('es-CL', { weekday: 'short' });

      const wo = workOrders.find(w => w.scheduledDate === dateStr);
      const dayTasks = wo ? allTasks.filter(t => t.workOrderId === wo.id) : [];
      const dayCompleted = dayTasks.filter(t => t.status === 'completado').length;

      last7Days.push({
        day: dayName,
        completed: dayCompleted,
        total: dayTasks.length,
      });
    }
    setWeeklyData(last7Days);
  }, []);

  const maxTasks = Math.max(...weeklyData.map(d => d.total), 1);

  return (
    <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            <nav className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Dashboard</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Indicadores</span>
            </nav>

            <header className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title">Indicadores de Gestión</h1>
                  <p className="page-subtitle">KPIs y métricas del programa de lubricación</p>
                </div>
              </div>
            </header>

            <div className="dashboard-grid">
              {metrics.map((metric, i) => (
                <div key={i} className="col-span-4">
                  <div className="stat-card">
                    <div className="stat-header">
                      <div className={`stat-icon ${metric.iconType}`}>
                        {metric.icon}
                      </div>
                      {metric.trend && (
                        <span className={`stat-trend ${metric.trend}`}>
                          {metric.trend === 'up' && <TrendingUp style={{ width: 12, height: 12 }} />}
                          {metric.trend === 'down' && <TrendingDown style={{ width: 12, height: 12 }} />}
                          {metric.trendValue}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="stat-value">{metric.value}</span>
                      <span className="stat-label">{metric.title}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Contractor Compliance Section */}
              <div className="col-span-12">
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-900) 100%)', color: 'white' }}>
                  <div className="card-header" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <Building2 style={{ width: 20, height: 20 }} />
                      <span className="card-title" style={{ color: 'white' }}>Cumplimiento Contratistas Externos</span>
                    </div>
                    <Link href="/contractors" className="btn btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                      Ver Detalle
                    </Link>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>94.5%</div>
                        <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>SLA Promedio</div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.6, marginTop: 'var(--space-1)' }}>Meta: 95%</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>2</div>
                        <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>Empresas Activas</div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.6, marginTop: 'var(--space-1)' }}>Contratos vigentes</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>2,139</div>
                        <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>Tareas Ejecutadas</div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.6, marginTop: 'var(--space-1)' }}>Este período</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>12</div>
                        <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>Auditorías</div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.6, marginTop: 'var(--space-1)' }}>Realizadas</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="col-span-12">
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">Cumplimiento Semanal</span>
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        <span style={{ width: 12, height: 12, background: 'var(--accent-500)', borderRadius: 2 }} />
                        Completadas
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        <span style={{ width: 12, height: 12, background: 'var(--slate-200)', borderRadius: 2 }} />
                        Programadas
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: 200, gap: 'var(--space-4)' }}>
                      {weeklyData.map((day, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', flex: 1 }}>
                          <div style={{ position: 'relative', width: '100%', height: 160, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <div
                              style={{
                                width: '60%',
                                maxWidth: 40,
                                height: `${(day.total / maxTasks) * 100}%`,
                                background: 'var(--slate-200)',
                                borderRadius: '4px 4px 0 0',
                                position: 'absolute',
                                bottom: 0,
                              }}
                            />
                            <div
                              style={{
                                width: '60%',
                                maxWidth: 40,
                                height: `${(day.completed / maxTasks) * 100}%`,
                                background: 'linear-gradient(180deg, var(--accent-400) 0%, var(--accent-500) 100%)',
                                borderRadius: '4px 4px 0 0',
                                position: 'absolute',
                                bottom: 0,
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                            {day.day}
                          </span>
                        </div>
                      ))}
                    </div>
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
