'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import type { WorkOrder, TaskExecution } from '@/types/work-order';

const getStatusBadge = (status: WorkOrder['status']) => {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Pendiente</Badge>;
    case 'in_progress':
      return <Badge variant="warning">En Progreso</Badge>;
    case 'completed':
      return <Badge variant="success">Completada</Badge>;
    case 'incomplete':
      return <Badge variant="default">Incompleta</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelada</Badge>;
    default:
      return <Badge variant="secondary">—</Badge>;
  }
};

const getTaskIcon = (status: TaskExecution['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-operational" />;
    case 'issue_reported':
      return <AlertTriangle className="w-5 h-5 text-alert-red" />;
    case 'skipped':
      return <Clock className="w-5 h-5 text-caution" />;
    default:
      return <Clock className="w-5 h-5 text-fog/50" />;
  }
};

const getTaskStatusLabel = (status: TaskExecution['status']) => {
  switch (status) {
    case 'completed':
      return 'Completado';
    case 'issue_reported':
      return 'Problema';
    case 'skipped':
      return 'Omitido';
    default:
      return 'Pendiente';
  }
};

interface WorkOrderDetailProps {
  workOrderId: string;
  onClose: () => void;
}

export function WorkOrderDetail({ workOrderId, onClose }: WorkOrderDetailProps) {
  const { fetchWorkOrderDetail } = useWorkOrders();
  const [workOrder, setWorkOrder] = useState<(WorkOrder & { task_executions: TaskExecution[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const detail = await fetchWorkOrderDetail(workOrderId);
        setWorkOrder(detail);
      } catch (err) {
        console.error('Error cargando detalle:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workOrderId]);

  if (loading) {
    return (
      <div className="p-6 rounded-sm bg-slate-panel border border-steel">
        <p className="text-fog">Cargando detalle...</p>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="p-6 rounded-sm bg-slate-panel border border-steel">
        <p className="text-alert-red">Error al cargar la orden de trabajo</p>
      </div>
    );
  }

  const completedTasks = workOrder.task_executions.filter((t) => t.status === 'completed').length;
  const totalTasks = workOrder.task_executions.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 rounded-sm bg-slate-panel border border-steel space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Detalle de Orden de Trabajo</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5 text-fog" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-fog">Ruta</p>
          <p className="text-white font-medium">{workOrder.route_name || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-fog">Lubricador</p>
          <p className="text-white font-medium">{workOrder.assigned_to_name || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-fog">Fecha</p>
          <p className="text-white font-mono">{workOrder.scheduled_date || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-fog">Estado</p>
          <div className="mt-1">{getStatusBadge(workOrder.status)}</div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-fog">Progreso</p>
          <p className="text-sm text-white font-mono">{completedTasks}/{totalTasks} ({progressPercent}%)</p>
        </div>
        <div className="w-full h-3 rounded-sm bg-carbon overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: progressPercent === 100 ? '#38A169' : '#D4740E',
            }}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-white mb-3">Puntos de Lubricación</h4>
        {workOrder.task_executions.length === 0 ? (
          <p className="text-fog text-sm">Sin tareas asignadas</p>
        ) : (
          <div className="space-y-2">
            {workOrder.task_executions.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-sm border"
                style={{
                  borderColor: task.status === 'completed'
                    ? '#38A169'
                    : task.status === 'issue_reported'
                    ? '#E53E3E'
                    : '#2D3748',
                  borderLeftWidth: '4px',
                  backgroundColor: 'rgba(15, 20, 25, 0.5)',
                }}
              >
                {getTaskIcon(task.status)}
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <div>
                    <p className="text-xs text-fog">#{index + 1}</p>
                    <p className="text-white font-mono text-sm">{task.point_code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-fog">Punto</p>
                    <p className="text-white text-sm">{task.point_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-fog">Máquina</p>
                    <p className="text-white text-sm">{task.machine_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-fog">Estado</p>
                    <p className="text-sm" style={{
                      color: task.status === 'completed'
                        ? '#38A169'
                        : task.status === 'issue_reported'
                        ? '#E53E3E'
                        : '#A0AEC0',
                    }}>
                      {getTaskStatusLabel(task.status)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {workOrder.notes && (
        <div>
          <h4 className="text-sm font-bold text-white mb-2">Notas</h4>
          <p className="text-fog text-sm">{workOrder.notes}</p>
        </div>
      )}
    </div>
  );
}
