'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Image as ImageIcon,
  Download,
  Clock,
  User,
  Droplets,
  FileText,
  ChevronDown,
  ChevronUp,
  Camera,
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { getAuditLogs } from '@/lib/anti-fraud';

interface CompletedTask {
  id: string;
  date: string;
  taskId: string;
  pointCode: string;
  pointDescription: string;
  machineName: string;
  lubricant: string;
  quantity: number;
  completedAt: string;
  photo?: string;
  technicianName: string;
}

export default function HistorialPage() {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [dates, setDates] = useState<string[]>([]);

  useEffect(() => {
    loadCompletedTasks();
  }, []);

  const loadCompletedTasks = () => {
    const workOrders = dataService.getWorkOrders();
    const tasks = dataService.getTasks();
    const points = dataService.getLubricationPoints();
    const components = dataService.getComponents();
    const machines = dataService.getMachines();
    const lubricants = dataService.getLubricants();

    // Filtrar tareas completadas
    const completed = tasks
      .filter(t => t.status === 'completado')
      .map(task => {
        const wo = workOrders.find(w => w.id === task.workOrderId);
        const point = points.find(p => p.id === task.lubricationPointId);
        const comp = point ? components.find(c => c.id === point.componentId) : null;
        const machine = comp ? machines.find(m => m.id === comp.machineId) : null;
        const lub = point ? lubricants.find(l => l.id === point.lubricantId) : null;

        return {
          id: task.id,
          date: wo?.scheduledDate || '',
          taskId: task.id,
          pointCode: point?.code || '',
          pointDescription: point?.description || '',
          machineName: machine?.name || '',
          lubricant: lub?.name || '',
          quantity: task.quantityUsed || point?.quantity || 0,
          completedAt: task.completedAt || '',
          photo: task.photoUrl,
          technicianName: 'Técnico',
        };
      })
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    setCompletedTasks(completed);

    // Obtener fechas únicas
    const uniqueDates = [...new Set(completed.map(t => t.date))].sort().reverse();
    setDates(uniqueDates);
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  };

  const filteredTasks = selectedDate
    ? completedTasks.filter(t => t.date === selectedDate)
    : completedTasks;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const todayTasks = completedTasks.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.date === today;
  });

  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            <nav className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Dashboard</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Historial de Tareas</span>
            </nav>

            <header className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText style={{ width: 28, height: 28, color: '#3b82f6' }} />
                    Historial de Trabajos
                  </h1>
                  <p className="page-subtitle">Registro completo de tareas ejecutadas con evidencia fotográfica</p>
                </div>
              </div>
            </header>

            {/* Resumen */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
              }}>
                <div style={{ fontSize: '36px', fontWeight: 800 }}>{completedTasks.length}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Tareas Completadas</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
              }}>
                <div style={{ fontSize: '36px', fontWeight: 800 }}>{todayTasks.length}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Completadas Hoy</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
              }}>
                <div style={{ fontSize: '36px', fontWeight: 800 }}>
                  {completedTasks.filter(t => t.photo).length}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Con Evidencia Fotográfica</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
              }}>
                <div style={{ fontSize: '36px', fontWeight: 800 }}>{dates.length}</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Días con Registros</div>
              </div>
            </div>

            {/* Filtro por fecha */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                  <Calendar style={{ width: 18, height: 18 }} />
                  Filtrar por fecha:
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    fontSize: '14px',
                    minWidth: '200px',
                  }}
                >
                  <option value="">Todas las fechas</option>
                  {dates.map(date => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
                <span style={{ color: '#64748b', fontSize: '14px' }}>
                  {filteredTasks.length} registros encontrados
                </span>
              </div>
            </div>

            {/* Lista de tareas */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Tareas Ejecutadas</span>
              </div>

              {filteredTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                  <FileText style={{ width: 48, height: 48, opacity: 0.3, marginBottom: '12px' }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>No hay tareas completadas</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                    Las tareas que completes aparecerán aquí con sus fotos
                  </p>
                </div>
              ) : (
                <div>
                  {filteredTasks.map(task => (
                    <div key={task.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      {/* Header de la tarea */}
                      <div
                        onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                        style={{
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          cursor: 'pointer',
                          background: expandedTask === task.id ? '#f8fafc' : 'white',
                          transition: 'background 0.2s',
                        }}
                      >
                        <div style={{
                          width: '44px',
                          height: '44px',
                          background: '#dcfce7',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <CheckCircle2 style={{ width: 22, height: 22, color: '#16a34a' }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              background: '#e2e8f0',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                            }}>
                              {task.pointCode}
                            </span>
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>
                              {task.machineName}
                            </span>
                            {task.photo && (
                              <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                color: '#8b5cf6',
                                background: '#f3e8ff',
                                padding: '2px 8px',
                                borderRadius: '10px',
                              }}>
                                <Camera style={{ width: 12, height: 12 }} />
                                Con foto
                              </span>
                            )}
                          </div>
                          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                            {task.pointDescription}
                          </p>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                            {formatTime(task.completedAt)}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {formatDate(task.date).split(',')[0]}
                          </div>
                        </div>

                        {expandedTask === task.id ? (
                          <ChevronUp style={{ width: 20, height: 20, color: '#94a3b8' }} />
                        ) : (
                          <ChevronDown style={{ width: 20, height: 20, color: '#94a3b8' }} />
                        )}
                      </div>

                      {/* Detalle expandido */}
                      {expandedTask === task.id && (
                        <div style={{
                          padding: '0 20px 20px 80px',
                          background: '#f8fafc',
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '16px',
                            marginBottom: '16px',
                          }}>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                                Lubricante
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Droplets style={{ width: 14, height: 14, color: '#3b82f6' }} />
                                {task.lubricant}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                                Cantidad Aplicada
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: 600 }}>
                                {task.quantity} gr/ml
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                                Hora Exacta
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock style={{ width: 14, height: 14 }} />
                                {formatTime(task.completedAt)}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                                Técnico
                              </div>
                              <div style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User style={{ width: 14, height: 14 }} />
                                {task.technicianName}
                              </div>
                            </div>
                          </div>

                          {/* Foto de evidencia */}
                          {task.photo ? (
                            <div>
                              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Evidencia Fotográfica
                              </div>
                              <div style={{
                                background: '#1e293b',
                                borderRadius: '12px',
                                padding: '8px',
                                display: 'inline-block',
                              }}>
                                <img
                                  src={task.photo}
                                  alt="Evidencia"
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    borderRadius: '8px',
                                    display: 'block',
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div style={{
                              background: '#fef3c7',
                              border: '1px solid #f59e0b',
                              borderRadius: '8px',
                              padding: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '13px',
                              color: '#92400e',
                            }}>
                              <ImageIcon style={{ width: 18, height: 18 }} />
                              Esta tarea no tiene foto adjunta
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Información de almacenamiento */}
            <div className="card" style={{ marginTop: '24px', background: '#f0f9ff', border: '1px solid #0ea5e9' }}>
              <div className="card-body">
                <h3 style={{ margin: '0 0 12px 0', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download style={{ width: 20, height: 20 }} />
                  ¿Dónde se guardan los datos?
                </h3>
                <div style={{ fontSize: '14px', color: '#0c4a6e', lineHeight: 1.6 }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>📱 En tu dispositivo:</strong> Los datos se guardan localmente para que funcionen sin internet.
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>☁️ En la nube (Supabase):</strong> Cuando hay conexión, se sincronizan automáticamente.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>📸 Las fotos:</strong> Se guardan con marca de agua (fecha, hora, tarea) y no se pueden reutilizar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
