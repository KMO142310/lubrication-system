'use client';

import { useState } from 'react';
import { Plus, Eye, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { useUsers } from '@/hooks/useUsers';
import { WorkOrderForm } from '@/components/supervisor/WorkOrderForm';
import { WorkOrderDetail } from '@/components/supervisor/WorkOrderDetail';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { WorkOrder } from '@/types/work-order';

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

export default function WorkOrdersPage() {
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [lubricatorFilter, setLubricatorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWOId, setSelectedWOId] = useState<string | null>(null);

  const { workOrders, loading, error, createWorkOrder, cancelWorkOrder } = useWorkOrders();
  const { users } = useUsers();

  const lubricators = users.filter((u) => u.role === 'lubricator' && u.is_active);

  const filteredOrders = workOrders.filter((wo) => {
    if (dateFilter && wo.scheduled_date !== dateFilter) return false;
    if (lubricatorFilter !== 'all' && wo.assigned_to !== lubricatorFilter) return false;
    if (statusFilter !== 'all' && wo.status !== statusFilter) return false;
    return true;
  });

  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: { route_id: string; assigned_to: string; scheduled_date: string }) => {
    try {
      await createWorkOrder(data);
      toast.success('Orden de trabajo creada correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear orden');
      throw err;
    }
  };

  const handleCancel = async (wo: WorkOrder) => {
    if (!confirm(`¿Estás seguro de cancelar esta orden de trabajo?`)) return;

    try {
      await cancelWorkOrder(wo.id);
      toast.success('Orden cancelada correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al cancelar orden');
    }
  };

  const handleViewDetail = (woId: string) => {
    setSelectedWOId(selectedWOId === woId ? null : woId);
  };

  const handleClearDate = () => {
    setDateFilter('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Cargando órdenes de trabajo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-alert-red">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Órdenes de Trabajo</h1>
          <p className="text-fog mt-1">
            Gestiona las órdenes de trabajo de lubricación
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-5 h-5" />
          Nueva Orden
        </Button>
      </div>

      <div className="flex items-end gap-4 p-4 rounded-sm bg-slate-panel/30 border border-slate-panel">
        <div className="space-y-1">
          <Label className="text-xs text-fog">Fecha</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-44"
            />
            {dateFilter && (
              <Button variant="ghost" size="sm" onClick={handleClearDate} className="text-fog">
                Todas
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-fog">Lubricador</Label>
          <Select value={lubricatorFilter} onValueChange={setLubricatorFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {lubricators.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-fog">Estado</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="in_progress">En Progreso</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
              <SelectItem value="incomplete">Incompleta</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-sm border border-slate-panel bg-slate-panel/30 p-12 text-center">
          <p className="text-fog text-lg mb-4">No hay órdenes de trabajo para los filtros seleccionados</p>
          <Button onClick={handleCreate} variant="outline" className="gap-2">
            <Plus className="w-5 h-5" />
            Crear primera orden
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-sm border border-slate-panel overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Lubricador</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((wo, index) => (
                  <>
                    <TableRow
                      key={wo.id}
                      className="cursor-pointer"
                      style={{
                        backgroundColor: index % 2 === 0 ? 'rgba(45, 55, 72, 0.3)' : 'transparent',
                      }}
                      onClick={() => handleViewDetail(wo.id)}
                    >
                      <TableCell className="text-white font-mono">
                        {wo.scheduled_date || '—'}
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {wo.route_name || '—'}
                      </TableCell>
                      <TableCell className="text-fog">
                        {wo.assigned_to_name || '—'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(wo.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-sm bg-carbon overflow-hidden">
                            <div
                              className="h-full rounded-sm"
                              style={{
                                width: `${wo.completion_percentage || 0}%`,
                                backgroundColor: wo.completion_percentage === 100 ? '#38A169' : '#D4740E',
                              }}
                            />
                          </div>
                          <span className="text-fog font-mono text-xs">
                            {wo.completion_percentage || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetail(wo.id)}
                            className="hover:bg-machinery/10 hover:text-machinery"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {wo.status !== 'cancelled' && wo.status !== 'completed' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCancel(wo)}
                              className="hover:bg-alert-red/10 hover:text-alert-red"
                              title="Cancelar"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {selectedWOId === wo.id && (
                      <TableRow key={`${wo.id}-detail`}>
                        <TableCell colSpan={6} className="p-0">
                          <WorkOrderDetail
                            workOrderId={wo.id}
                            onClose={() => setSelectedWOId(null)}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <WorkOrderForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
