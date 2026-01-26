'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
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
  BarChart3,
  Play,
  Calendar,
  LogOut
} from 'lucide-react';
import NavigationCard from '@/components/NavigationCard';
import { dataService } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { getCompletedTasksFromServer, isOnline } from '@/lib/sync';
import { calculateCompliance } from '@/lib/analytics';
import MetricCard from '@/components/MetricCard';
import type { Task, LubricationPoint, Component, Machine, Lubricant } from '@/lib/types';

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
    description: string; // Combined component/machine info
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
      // 1. Get today's Work Order and Tasks
      const todayWO = dataService.getTodayWorkOrder();

      if (!todayWO) {
        setStats({ compliance: 0, todayTasks: 0, todayCompleted: 0 });
        setTodayTasksList([]);
        return;
      }

      const todayTasks = dataService.getTasks(todayWO.id);

      // 2. Get completed tasks (local + server)
      const localCompleted = todayTasks.filter(t => t.status === 'completado').length;

      // Try to get server data if online
      let serverCompletedCount = 0;
      let completedTaskIds = new Set<string>();

      try {
        if (isOnline()) {
          const serverTasks = await getCompletedTasksFromServer() as ServerTaskData[];
          if (serverTasks && serverTasks.length > 0) {
            // Filter strictly for today's tasks that are completed
            const serverTodayCompleted = serverTasks.filter(st => {
              // Check if this server task corresponds to one of our today tasks
              const isTodayTask = todayTasks.some(tt => tt.id === st.id);
              return isTodayTask && st.status === 'completado';
            });
            serverCompletedCount = serverTodayCompleted.length;

            // Track IDs for the list display
            serverTodayCompleted.forEach(t => completedTaskIds.add(t.id));
          }
        }
      } catch (error) {
        console.error("Error fetching server stats:", error);
      }

      // Use the higher count (local sync might be pending)
      const finalCompleted = Math.max(localCompleted, serverCompletedCount);

      // 3. Calculate Compliance
      const compliance = calculateCompliance(finalCompleted, todayTasks.length);

      setStats({
        compliance,
        todayTasks: todayTasks.length,
        todayCompleted: finalCompleted
      });

      // 4. Enrich tasks for display
      // We need catalogs to resolve IDs
      const points = dataService.getLubricationPoints();
      const components = dataService.getComponents();
      const machines = dataService.getMachines();
      const lubricants = dataService.getLubricants();

      const displayTasks = todayTasks.slice(0, 3).map(t => {
        const point = points.find(p => p.id === t.lubricationPointId);
        const component = point ? components.find(c => c.id === point.componentId) : null;
        const machine = component ? machines.find(m => m.id === component.machineId) : null;
        const lubricant = point ? lubricants.find(l => l.id === point.lubricantId) : null;

        const description = point
          ? `${component?.name || 'Unknown'} - ${machine?.name || 'Unknown'}`
          : 'Tarea desconocida';

        const code = point?.code || t.id.substring(0, 8);
        const lubName = lubricant?.name || 'N/A';

        return {
          id: t.id,
          code: code,
          description: description,
          status: t.status === 'completado' || completedTaskIds.has(t.id) ? 'completado' : 'pendiente',
          lubricant: lubName
        };
      });

      setTodayTasksList(displayTasks);
    }

    loadStats();
  }, [user]);

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #1e293b',
              paddingBottom: '24px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '8px',
                  letterSpacing: '-0.5px'
                }}>
                  Panel de Control
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>
                  Resumen de operaciones y estado del sistema
                </p>
              </div>

              <div style={{
                background: 'rgba(51, 65, 85, 0.5)',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Calendar style={{ width: 16, height: 16, color: '#94a3b8' }} />
                <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600 }}>
                  {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
              <section>
                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  marginBottom: '32px'
                }}>
                  <MetricCard
                    label="Cumplimiento"
                    value={stats.compliance}
                    subValue="%"
                    badgeText="+2.4%"
                    icon={Target}
                    colorTheme="success"
                    href="/metrics"
                  />
                  <MetricCard
                    label="Tareas Hoy"
                    value={stats.todayTasks}
                    footerText={`${stats.todayCompleted} completadas`}
                    icon={ClipboardCheck}
                    colorTheme="primary"
                    href="/tasks"
                  />
                  <MetricCard
                    label="Anomalías"
                    value="0"
                    footerText="Sin reportes activos"
                    icon={AlertTriangle}
                    colorTheme="warning"
                    href="/anomalies"
                  />
                </div>

                {/* Recent Activity / Tasks Preview */}
                <div style={{
                  background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                  borderRadius: '16px',
                  border: '1px solid #334155',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}>
                  <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #334155',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(30, 41, 59, 0.5)',
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock style={{ width: 18, height: 18, color: '#3b82f6' }} />
                      Actividad de Hoy
                    </h3>
                    <Link href="/tasks" style={{
                      fontSize: '13px',
                      color: '#3b82f6',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      Ver todo <ArrowRight style={{ width: 14, height: 14 }} />
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
                                {task.description}
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>
                                {task.lubricant}
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
                    <NavigationCard
                      href="/tasks"
                      title="Ejecutar Tareas"
                      subtitle="Lubricación diaria"
                      icon={Play}
                      color="#f59e0b"
                      bgColorRgba="rgba(245, 158, 11, 0.1)"
                    />

                    <NavigationCard
                      href="/anomalies"
                      title="Reportar Anomalía"
                      subtitle="Problemas detectados"
                      icon={AlertTriangle}
                      color="#ef4444"
                      bgColorRgba="rgba(239, 68, 68, 0.1)"
                    />

                    <NavigationCard
                      href="/metrics"
                      title="Ver Métricas"
                      subtitle="Dashboard de control"
                      icon={BarChart3}
                      color="#3b82f6"
                      bgColorRgba="rgba(59, 130, 246, 0.1)"
                    />
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
