'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useLubricationPoints } from '@/hooks/useLubricationPoints';
import { LubricationPointForm } from '@/components/supervisor/LubricationPointForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { LubricationPoint } from '@/types/lubrication-point';

const getMethodBadge = (method: LubricationPoint['method']) => {
  if (!method) return <Badge variant="secondary">Sin método</Badge>;
  
  const methodLabels = {
    manual_grease: 'Grasa manual',
    oil_can: 'Aceitera',
    automatic: 'Automático',
    spray: 'Spray',
    immersion: 'Inmersión',
  };

  const methodColors = {
    manual_grease: 'default',
    oil_can: 'secondary',
    automatic: 'success',
    spray: 'warning',
    immersion: 'outline',
  } as const;

  return (
    <Badge variant={methodColors[method]}>
      {methodLabels[method]}
    </Badge>
  );
};

const getFrequencyLabel = (point: LubricationPoint) => {
  if (!point.frequency_type) return '—';
  
  const frequencyLabels = {
    daily: 'Diaria',
    weekly: 'Semanal',
    biweekly: 'Quincenal',
    monthly: 'Mensual',
    custom: point.frequency_hours ? `${point.frequency_hours}h` : 'Personalizada',
  };

  return frequencyLabels[point.frequency_type];
};

export default function LubricationPointsPage() {
  const { lubricationPoints, loading, error, createLubricationPoint, updateLubricationPoint, deleteLubricationPoint } = useLubricationPoints();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<LubricationPoint | null>(null);

  const handleCreate = () => {
    setSelectedPoint(null);
    setIsFormOpen(true);
  };

  const handleEdit = (point: LubricationPoint) => {
    setSelectedPoint(point);
    setIsFormOpen(true);
  };

  const handleDelete = async (point: LubricationPoint) => {
    if (!confirm(`¿Estás seguro de eliminar el punto "${point.name}"?`)) {
      return;
    }

    try {
      await deleteLubricationPoint(point.id);
      toast.success('Punto de lubricación eliminado correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar punto');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      const pointData = {
        name: data.name,
        code: data.code,
        machine_id: data.machine_id || null,
        lubricant_type_id: data.lubricant_type_id || null,
        method: data.method || null,
        quantity_ml: data.quantity_ml,
        frequency_type: data.frequency_type || null,
        frequency_hours: data.frequency_hours || null,
        location_description: data.location_description || null,
        safety_notes: data.safety_notes || null,
        is_active: data.is_active,
        image_url: null,
      };

      if (selectedPoint) {
        await updateLubricationPoint(selectedPoint.id, pointData);
        toast.success('Punto de lubricación actualizado correctamente');
      } else {
        await createLubricationPoint(pointData);
        toast.success('Punto de lubricación creado correctamente');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar punto');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Cargando puntos de lubricación...</p>
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
          <h1 className="text-3xl font-bold text-white">Puntos de Lubricación</h1>
          <p className="text-fog mt-1">
            Gestiona los puntos físicos de lubricación de tu maquinaria
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Punto
        </Button>
      </div>

      {lubricationPoints.length === 0 ? (
        <div className="rounded-sm border border-slate-panel bg-slate-panel/30 p-12 text-center">
          <p className="text-fog text-lg mb-4">No hay puntos de lubricación registrados</p>
          <Button onClick={handleCreate} variant="outline" className="gap-2">
            <Plus className="w-5 h-5" />
            Crear primer punto
          </Button>
        </div>
      ) : (
        <div className="rounded-sm border border-slate-panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Máquina</TableHead>
                <TableHead>Lubricante</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Frecuencia</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lubricationPoints.map((point, index) => (
                <TableRow
                  key={point.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(45, 55, 72, 0.3)' : 'transparent',
                  }}
                >
                  <TableCell className="font-mono text-white font-medium">
                    {point.code}
                  </TableCell>
                  <TableCell className="text-white">
                    {point.name}
                  </TableCell>
                  <TableCell className="text-fog">
                    {point.machine_name || '—'}
                  </TableCell>
                  <TableCell className="text-fog">
                    {point.lubricant_name || '—'}
                  </TableCell>
                  <TableCell>
                    {getMethodBadge(point.method)}
                  </TableCell>
                  <TableCell className="text-fog">
                    {getFrequencyLabel(point)}
                  </TableCell>
                  <TableCell className="text-fog font-mono">
                    {point.quantity_ml} ml
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(point)}
                        className="hover:bg-machinery/10 hover:text-machinery"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(point)}
                        className="hover:bg-alert-red/10 hover:text-alert-red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <LubricationPointForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        lubricationPoint={selectedPoint}
      />
    </div>
  );
}
