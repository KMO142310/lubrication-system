'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertCircle, X, CalendarPlus } from 'lucide-react';
import { dataService } from '@/lib/data';
import { WorkOrder, Task } from '@/lib/types';

interface DayData {
  date: Date;
  workOrder?: WorkOrder;
  tasks: Task[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const buildCalendar = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const workOrders = dataService.getWorkOrders();
    const allTasks = dataService.getTasks();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: DayData[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const wo = workOrders.find(o => o.scheduledDate === dateStr);
      const tasks = wo ? allTasks.filter(t => t.workOrderId === wo.id) : [];

      const dayDate = new Date(current);
      dayDate.setHours(0, 0, 0, 0);

      days.push({
        date: new Date(current),
        workOrder: wo,
        tasks,
        isToday: dayDate.getTime() === today.getTime(),
        isCurrentMonth: current.getMonth() === month,
      });

      current.setDate(current.getDate() + 1);
    }

    setCalendarDays(days);
  }, [currentDate]);

  useEffect(() => {
    buildCalendar();
  }, [buildCalendar]);

  const navigateMonth = (delta: number) => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + delta);
      return next;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };



  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <ProtectedRoute allowedRoles={['desarrollador', 'supervisor']}>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            <nav className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Dashboard</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Planificación</span>
            </nav>

            <header className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title">Planificación</h1>
                  <p className="page-subtitle">Calendario de órdenes de trabajo</p>
                </div>
                <button className="btn btn-secondary" onClick={goToToday}>
                  <CalendarPlus style={{ width: 16, height: 16 }} />
                  Ir a Hoy
                </button>
              </div>
            </header>

            <div className="dashboard-grid">
              <div className="col-span-12">
                <div className="card">
                  {/* Calendar Navigation */}
                  <div className="card-header" style={{ justifyContent: 'center', gap: 'var(--space-8)' }}>
                    <button className="btn btn-ghost btn-icon" onClick={() => navigateMonth(-1)}>
                      <ChevronLeft style={{ width: 20, height: 20 }} />
                    </button>
                    <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, minWidth: 220, textAlign: 'center' }}>
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button className="btn btn-ghost btn-icon" onClick={() => navigateMonth(1)}>
                      <ChevronRight style={{ width: 20, height: 20 }} />
                    </button>
                  </div>

                  <div className="card-body" style={{ padding: 0 }}>
                    <div className="calendar-container">
                      <div className="calendar-grid">
                        {/* Day Headers */}
                        {dayNames.map(day => (
                          <div key={day} className="calendar-day-header">
                            {day}
                          </div>
                        ))}

                        {/* Calendar Days */}
                        {calendarDays.map((day, i) => {
                          const completed = day.tasks.filter(t => t.status === 'completado').length;
                          const total = day.tasks.length;
                          const allCompleted = total > 0 && completed === total;

                          return (
                            <div
                              key={i}
                              onClick={() => day.workOrder && setSelectedDay(day)}
                              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${allCompleted ? 'completed' : total > 0 ? 'has-tasks' : ''}`}
                            >
                              <span className="calendar-day-number">
                                {day.date.getDate()}
                              </span>
                              {total > 0 && (
                                <div className="calendar-day-tasks">
                                  {day.tasks.slice(0, 5).map((t, idx) => (
                                    <span
                                      key={idx}
                                      className={`calendar-task-dot ${t.status === 'completado' ? 'completed' : ''}`}
                                    />
                                  ))}
                                  {total > 5 && (
                                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>+{total - 5}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="card-footer" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-8)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      <CheckCircle2 style={{ width: 14, height: 14, color: 'var(--success-500)' }} />
                      Completado
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      <Clock style={{ width: 14, height: 14, color: 'var(--warning-500)' }} />
                      En Progreso
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      <AlertCircle style={{ width: 14, height: 14, color: 'var(--accent-500)' }} />
                      Pendiente
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Day Detail Modal */}
        {selectedDay && (
          <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {selectedDay.date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h2>
                <button className="modal-close" onClick={() => setSelectedDay(null)}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>

              <div className="modal-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Estado</span>
                  <span className={`badge ${selectedDay.workOrder?.status === 'completado' ? 'badge-success' : selectedDay.workOrder?.status === 'en_progreso' ? 'badge-warning' : 'badge-danger'}`}>
                    {selectedDay.workOrder?.status === 'completado' ? 'Completado' :
                      selectedDay.workOrder?.status === 'en_progreso' ? 'En Progreso' : 'Pendiente'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Progreso</span>
                  <span style={{ fontWeight: 600 }}>
                    {selectedDay.tasks.filter(t => t.status === 'completado').length} / {selectedDay.tasks.length} tareas
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedDay(null)}>
                  Cerrar
                </button>
                <Link href="/tasks" className="btn btn-primary">
                  Ver Tareas
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
