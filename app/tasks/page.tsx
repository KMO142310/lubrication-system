'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import SignaturePad from '@/components/SignaturePad';
import PhotoUpload from '@/components/PhotoUpload';
import DailyReport from '@/components/DailyReport';
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Droplets,
  X,
  Play,
  Clock,
  MapPin,
  Wrench,
  FileText,
  PenTool,
  Settings,
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { saveCompletedTask, getCompletedTasksFromServer, isOnline } from '@/lib/sync';
import { useSmartTasks } from '@/hooks/useSmartTasks';
import { validateTaskExecution } from '@/lib/quality-control';
import { useAuth } from '@/lib/auth';
import { generateWorkOrderPDF } from '@/lib/pdf';
import { Task, LubricationPoint, WorkOrder, Component, Machine, Lubricant, Frequency } from '@/lib/types';

interface EnrichedTask extends Task {
  lubricationPoint: LubricationPoint;
  component: Component;
  machine: Machine;
  lubricant: Lubricant;
  frequency: Frequency;
}

interface TaskExecution {
  photoBefore: string;
  photoAfter: string;
  quantityUsed: number;
  observations: string;
}

export default function TasksPage() {
  const { user } = useAuth();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const today = new Date();
  const { tasks: smartTasks, isLoading: loading, completeTask } = useSmartTasks(today);

  // Estados de UI
  const [selectedTask, setSelectedTask] = useState<EnrichedTask | null>(null);
  const [executionMode, setExecutionMode] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showDailyReport, setShowDailyReport] = useState(false);
  const [execution, setExecution] = useState<TaskExecution>({
    photoBefore: '',
    photoAfter: '',
    quantityUsed: 0,
    observations: '',
  });

  // Transformar offline tasks a formato visual de la UI
  // Nota: En una refactorización mayor, eliminaríamos 'dataService' y usaríamos solo 'smartTasks'
  // Por ahora, hacemos un merge en memoria para mantener compatibilidad con el resto de la UI
  const [enrichedTasks, setEnrichedTasks] = useState<EnrichedTask[]>([]);

  useEffect(() => {
    if (!smartTasks) return;

    // Aquí enriqueceríamos los datos offline con los maestros (máquinas, componentes)
    // Para simplificar esta iteración, seguimos usando dataService para los maestros estáticos
    // y usamos smartTasks para el estado dinámico (status, quantity).

    dataService.init(); // Asegurar maestros cargados
    const points = dataService.getLubricationPoints();
    const components = dataService.getComponents();
    const machines = dataService.getMachines();
    const lubricants = dataService.getLubricants();
    const frequencies = dataService.getFrequencies();

    // Workaround: Obtener tareas base del día desde dataService para tener la estructura
    // y sobreescribir estado con lo que viene de Dexie (smartTasks)
    const baseTasks = dataService.getTasks(dataService.getTodayWorkOrder()?.id || '');

    const todayWO = dataService.getTodayWorkOrder();
    if (todayWO) {
      setWorkOrder(todayWO);
    }

    const merged = baseTasks.map(baseTask => {
      const offlineVersion = smartTasks.find(t => t.id === baseTask.id);

      // Estado final: Si hay versión offline manda esa, sino la base
      const status = offlineVersion ? offlineVersion.status : baseTask.status;
      const qty = offlineVersion ? offlineVersion.quantity_used : baseTask.quantityUsed;

      // Enriquecer
      const lp = points.find(p => p.id === baseTask.lubricationPointId)!;
      const comp = lp ? components.find(c => c.id === lp.componentId) : null;
      const mach = comp ? machines.find(m => m.id === comp.machineId) : null;
      const lub = lp ? lubricants.find(l => l.id === lp.lubricantId) : null;
      const freq = lp ? frequencies.find(f => f.id === lp.frequencyId) : null;

      return {
        ...baseTask,
        status: status as any,
        quantityUsed: qty,
        lubricationPoint: lp,
        component: comp!,
        machine: mach!,
        lubricant: lub!,
        frequency: freq!
      };
    }).filter(t => t.lubricationPoint && t.machine); // Filtrar data incompleta

    setEnrichedTasks(merged);

  }, [smartTasks]);

  // Aliases para compatibilidad con código existente
  const tasks = enrichedTasks;

  const openTaskExecution = (task: EnrichedTask) => {
    setSelectedTask(task);
    setExecution({
      photoBefore: '',
      photoAfter: '',
      quantityUsed: task.lubricationPoint.quantity,
      observations: '',
    });
    setExecutionMode(true);
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;

    if (!execution.photoAfter) {
      toast.error('Debe adjuntar la foto posterior a la lubricación');
      return;
    }

    // Quality Control Validation
    const validation = validateTaskExecution(
      execution.quantityUsed,
      selectedTask.lubricationPoint.quantity,
      selectedTask.lubricationPoint.unit || 'ml'
    );

    if (!validation.valid) {
      toast.error(validation.error || 'Error de validación');
      return; // Block execution
    }

    if (validation.warning) {
      // En un caso real usaríamos un toast.custom con botones de Confirmar
      // Por ahora, solo mostramos el warning y permitimos continuar si el usuario da click de nuevo?
      // Simplificación: Bloqueamos warnings severos, o permitimos con confirmación nativa
      if (!confirm(`ADVERTENCIA: ${validation.warning}\n¿Desea continuar de todas formas?`)) {
        return;
      }
    }

    // AGI Pattern: Usar la abstracción offline-first
    // Esto es instantáneo en UI y asíncrono en red (Fire & Forget)
    await completeTask(selectedTask.id, execution.quantityUsed, execution.observations);

    toast.success('Tarea guardada localmente (Subiendo...)');

    // Cerrar modal inmediatamente
    setSelectedTask(null);
    setExecutionMode(false);
  };

  const handleSignRoute = (signatureUrl: string) => {
    if (workOrder) {
      dataService.updateWorkOrder(workOrder.id, {
        status: 'completado',
        completedAt: new Date().toISOString(),
      });

      // Generate PDF with photo evidence
      const pdfData = {
        code: `OT-${workOrder.scheduledDate.replace(/-/g, '')}`,
        date: new Date(workOrder.scheduledDate).toLocaleDateString('es-CL', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        technician: user?.name || 'Técnico',
        company: 'AISA - Aserraderos Industriales S.A.',
        plant: 'Planta Principal - Línea de Producción',
        shift: new Date().getHours() < 14 ? 'Turno Mañana (06:00 - 14:00)' : 'Turno Tarde (14:00 - 22:00)',
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'completado').length,
        tasks: tasks.map(t => ({
          code: t.lubricationPoint.code,
          machine: t.machine.name,
          component: t.component.name,
          lubricant: t.lubricant.name,
          method: t.lubricationPoint.method,
          quantityUsed: t.quantityUsed ? `${t.quantityUsed} ${t.lubricant.type === 'grasa' ? 'g' : 'ml'}` : '-',
          status: t.status,
          observations: t.observations || '',
          photoUrl: t.photoUrl,
          completedAt: t.completedAt ? new Date(t.completedAt).toLocaleString('es-CL') : undefined,
        })),
        signature: signatureUrl,
        completedAt: new Date().toLocaleString('es-CL'),
      };

      generateWorkOrderPDF(pdfData);
      toast.success('Ruta firmada y PDF descargado');
      setShowSignature(false);
    }
  };

  const closeModal = () => {
    setSelectedTask(null);
    setExecutionMode(false);
  };

  const completedCount = tasks.filter(t => t.status === 'completado').length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const allCompleted = completedCount === tasks.length && tasks.length > 0;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <div className="page-container loading-container">
              <div className="loading-spinner" />
              <p>Cargando tareas...</p>
            </div>
          </main>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: var(--space-4);
            color: var(--text-muted);
          }
        `}</style>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            {/* Header Industrial */}
            <div className="industrial-header">
              <div className="header-badge">
                <Clock style={{ width: 16, height: 16 }} />
                <span>RUTA ACTIVA</span>
              </div>
              <h1>Mis Tareas de Hoy</h1>
              <div className="header-meta">
                <span className="meta-item">
                  <MapPin style={{ width: 14, height: 14 }} />
                  AISA
                </span>
                <span className="meta-item">
                  <Wrench style={{ width: 14, height: 14 }} />
                  {user?.name || 'Técnico'}
                </span>
                <span className="meta-date">
                  {new Date().toLocaleDateString('es-CL', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {workOrder ? (
              <>
                {/* Progress Panel */}
                <div className="progress-panel">
                  <div className="progress-info">
                    <div className="progress-main">
                      <span className="progress-number">{completedCount}</span>
                      <span className="progress-divider">/</span>
                      <span className="progress-total">{tasks.length}</span>
                    </div>
                    <span className="progress-text">Tareas Completadas</span>
                  </div>
                  <div className="progress-ring">
                    <svg viewBox="0 0 100 100">
                      <circle className="ring-bg" cx="50" cy="50" r="45" />
                      <circle
                        className="ring-fill"
                        cx="50" cy="50" r="45"
                        style={{ strokeDashoffset: 283 - (283 * progress / 100) }}
                      />
                    </svg>
                    <span className="ring-percent">{Math.round(progress)}%</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="progress-actions">
                    <button className="btn btn-secondary" onClick={() => setShowDailyReport(true)}>
                      <FileText style={{ width: 16, height: 16 }} />
                      Ver Informe
                    </button>
                    {allCompleted ? (
                      <button className="btn btn-primary sign-btn" onClick={() => setShowSignature(true)}>
                        <PenTool style={{ width: 18, height: 18 }} />
                        Firmar y Cerrar Ruta
                      </button>
                    ) : (
                      <button className="btn btn-secondary" disabled style={{ opacity: 0.6 }}>
                        <Clock style={{ width: 16, height: 16 }} />
                        Pendiente firmar
                      </button>
                    )}
                  </div>
                </div>

                {/* Task Cards */}
                <div className="task-grid">
                  {tasks.map(task => (
                    <JobCard
                      key={task.id}
                      task={task}
                      onClick={openTaskExecution}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-panel">
                <AlertTriangle style={{ width: 48, height: 48 }} />
                <h2>Sin Tareas Programadas</h2>
                <p>No hay órdenes de trabajo para hoy.</p>
                <Link href="/schedule" className="btn btn-primary">
                  Ver Calendario
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Execution Modal */}
      {selectedTask && executionMode && (
        <div className="execution-overlay" onClick={closeModal}>
          <div className="execution-modal" onClick={e => e.stopPropagation()}>
            <div className="execution-header">
              <div>
                <span className="execution-code">{selectedTask.lubricationPoint.code}</span>
                <h2>{selectedTask.machine.name}</h2>
              </div>
              <button className="close-btn" onClick={closeModal}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div className="execution-body">
              {/* Task Info */}
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Componente</span>
                  <span className="info-value">{selectedTask.component.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Lubricante</span>
                  <span className="info-value">{selectedTask.lubricant.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Método</span>
                  <span className="info-value method">{selectedTask.lubricationPoint.method}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Frecuencia</span>
                  <span className="info-value">{selectedTask.frequency.name}</span>
                </div>
              </div>

              {/* Photo Uploads */}
              <div className="photos-section">
                <h3>Registro Fotográfico</h3>
                <div className="photos-grid">
                  <PhotoUpload
                    label="Foto Antes (Opcional)"
                    onPhotoCapture={(url) => setExecution(prev => ({ ...prev, photoBefore: url }))}
                    taskId={selectedTask?.lubricationPoint.code || 'N/A'}
                    userId={user?.name || 'Técnico'}
                    photoType="before"
                  />
                  <PhotoUpload
                    label="Foto Después"
                    onPhotoCapture={(url) => setExecution(prev => ({ ...prev, photoAfter: url }))}
                    required
                    taskId={selectedTask?.lubricationPoint.code || 'N/A'}
                    userId={user?.name || 'Técnico'}
                    photoType="after"
                  />
                </div>
              </div>

              {/* Observations */}
              <div className="observations-section">
                <label>Observaciones</label>
                <textarea
                  placeholder="Ingrese cualquier observación o novedad..."
                  value={execution.observations}
                  onChange={e => setExecution(prev => ({ ...prev, observations: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="execution-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button
                className="btn btn-primary complete-btn"
                onClick={handleCompleteTask}
                disabled={!execution.photoAfter}
              >
                <CheckCircle2 style={{ width: 18, height: 18 }} />
                Completar Tarea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignature && (
        <div className="execution-overlay" onClick={() => setShowSignature(false)}>
          <div className="signature-modal" onClick={e => e.stopPropagation()}>
            <SignaturePad
              onSave={handleSignRoute}
              onCancel={() => setShowSignature(false)}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        /* Styles from previous implementation... */
        .industrial-header {
          margin-bottom: var(--space-8);
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          background: var(--success-500);
          color: white;
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.1em;
          border-radius: var(--radius-full);
          margin-bottom: var(--space-3);
        }

        .industrial-header h1 {
          font-size: var(--text-4xl);
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
          letter-spacing: var(--tracking-tighter);
        }

        .header-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
          color: var(--text-muted);
          font-size: var(--text-sm);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .meta-date {
          text-transform: capitalize;
        }

        .progress-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-6);
          background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-900) 100%);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          margin-bottom: var(--space-6);
          color: white;
        }

        .progress-info {
          text-align: left;
        }

        .progress-main {
          display: flex;
          align-items: baseline;
          gap: var(--space-1);
        }

        .progress-number {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1;
        }

        .progress-divider {
          font-size: 2rem;
          opacity: 0.5;
        }

        .progress-total {
          font-size: 2rem;
          font-weight: 600;
          opacity: 0.7;
        }

        .progress-text {
          font-size: var(--text-lg);
          opacity: 0.8;
          margin-top: var(--space-2);
          display: block;
        }

        .progress-ring {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .progress-ring svg {
          transform: rotate(-90deg);
          width: 100%;
          height: 100%;
        }

        .ring-bg {
          fill: none;
          stroke: rgba(255,255,255,0.2);
          stroke-width: 8;
        }

        .ring-fill {
          fill: none;
          stroke: var(--success-400);
          stroke-width: 8;
          stroke-linecap: round;
          stroke-dasharray: 283;
          transition: stroke-dashoffset 0.5s ease;
        }

        .ring-percent {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: var(--text-2xl);
          font-weight: 800;
        }

        .progress-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          width: 100%;
          margin-top: 12px;
        }

        .progress-actions .btn {
          flex: 1;
          min-width: 140px;
          white-space: nowrap;
          font-size: 13px;
          padding: 10px 12px;
        }

        .sign-btn {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: var(--space-4);
        }

        .task-card {
          background: var(--surface);
          border: 2px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-5);
          cursor: pointer;
          transition: all var(--duration-normal) var(--ease-out);
        }

        .task-card:hover:not(.completed) {
          border-color: var(--accent-400);
          box-shadow: var(--shadow-lg), 0 0 0 4px rgba(220, 38, 38, 0.1);
          transform: translateY(-2px);
        }

        .task-card.completed {
          border-color: var(--success-300);
          background: var(--success-50);
          cursor: default;
        }

        .task-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }

        .task-code {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--accent-600);
          background: var(--accent-100);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
        }

        .task-status {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-xs);
          font-weight: 600;
        }

        .task-status.completado {
          color: var(--success-600);
        }

        .task-status.pendiente {
          color: var(--text-muted);
        }

        .task-machine {
          font-size: var(--text-lg);
          font-weight: 700;
          margin-bottom: var(--space-1);
        }

        .task-description {
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--space-4);
        }

        .task-specs {
          display: flex;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
        }

        .spec {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .task-action {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--accent-500);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: var(--text-sm);
          cursor: pointer;
          transition: background var(--duration-fast);
        }

        .task-action:hover {
          background: var(--accent-600);
        }

        .empty-panel {
          text-align: center;
          padding: var(--space-16);
          background: var(--surface);
          border-radius: var(--radius-2xl);
          border: 1px solid var(--border);
          color: var(--text-muted);
        }

        .empty-panel h2 {
          margin: var(--space-4) 0 var(--space-2);
          color: var(--text-primary);
        }

        .empty-panel p {
          margin-bottom: var(--space-6);
        }

        .execution-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: var(--space-4);
        }

        .execution-modal,
        .signature-modal {
          background: var(--surface);
          border-radius: var(--radius-2xl);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .signature-modal {
          max-width: 500px;
          padding: 0;
        }

        .execution-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: var(--space-6);
          background: linear-gradient(135deg, var(--primary-800) 0%, var(--primary-900) 100%);
          color: white;
        }

        .execution-code {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          font-weight: 700;
          background: rgba(255,255,255,0.2);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-2);
        }

        .execution-header h2 {
          font-size: var(--text-xl);
          font-weight: 700;
          color: white;
        }

        .close-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: var(--radius-md);
          padding: var(--space-2);
          color: white;
          cursor: pointer;
          transition: background var(--duration-fast);
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .execution-body {
          padding: var(--space-6);
          overflow-y: auto;
          flex: 1;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }

        .info-item {
          background: var(--slate-50);
          padding: var(--space-3);
          border-radius: var(--radius-md);
        }

        .info-label {
          display: block;
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-bottom: var(--space-1);
        }

        .info-value {
          font-weight: 600;
          font-size: var(--text-sm);
        }

        .info-value.method {
          text-transform: capitalize;
          color: var(--primary-600);
        }

        .photos-section h3 {
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--space-4);
        }

        .photos-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .quantity-section,
        .observations-section {
          margin-bottom: var(--space-4);
        }

        .quantity-section label,
        .observations-section label {
          display: block;
          font-weight: 600;
          font-size: var(--text-sm);
          margin-bottom: var(--space-2);
        }

        .quantity-input {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .quantity-input input {
          width: 120px;
          padding: var(--space-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--text-lg);
          font-weight: 600;
          text-align: center;
        }

        .quantity-input .unit {
          color: var(--text-muted);
        }

        .observations-section textarea {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          resize: vertical;
          font-family: inherit;
        }

        .execution-footer {
          display: flex;
          gap: var(--space-3);
          justify-content: flex-end;
          padding: var(--space-5) var(--space-6);
          background: var(--slate-50);
          border-top: 1px solid var(--border);
        }

        .complete-btn {
          min-width: 180px;
        }

        .complete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .photos-grid,
          .info-grid {
            grid-template-columns: 1fr;
          }

          .progress-panel {
            flex-direction: column;
            text-align: center;
          }

          .progress-info {
            text-align: center;
          }
        }
      `}</style>

      {/* Daily Report Modal */}
      {showDailyReport && (
        <DailyReport
          date={workOrder?.scheduledDate || new Date().toISOString().split('T')[0]}
          technician={user?.name || 'Técnico'}
          tasks={tasks.map(t => ({
            id: t.id,
            code: t.lubricationPoint.code,
            component: t.component.name,
            machine: t.machine.name,
            lubricant: t.lubricant.name,
            method: t.lubricationPoint.method,
            quantityUsed: t.quantityUsed,
            unit: t.lubricant.type === 'grasa' ? 'g' : 'ml',
            status: t.status as 'completado' | 'pendiente' | 'omitido',
            completedAt: t.completedAt,
            observations: t.observations
          }))}
          onClose={() => setShowDailyReport(false)}
          onDownload={() => {
            if (workOrder) {
              generateWorkOrderPDF({
                code: `OT-${workOrder.id.slice(-4).toUpperCase()}`,
                date: new Date(workOrder.scheduledDate).toLocaleDateString('es-CL'),
                technician: user?.name || 'Técnico',
                company: 'AISA',
                totalTasks: tasks.length,
                completedTasks: tasks.filter(t => t.status === 'completado').length,
                tasks: tasks.map(t => ({
                  code: t.lubricationPoint.code,
                  machine: t.machine.name,
                  component: t.component.name,
                  lubricant: t.lubricant.name,
                  method: t.lubricationPoint.method,
                  quantityUsed: t.quantityUsed ? `${t.quantityUsed} ${t.lubricant.type === 'grasa' ? 'g' : 'ml'}` : undefined,
                  status: t.status,
                  observations: t.observations,
                })),
                signature: ''
              });
            }
          }}
        />
      )}
    </ProtectedRoute>
  );
}
