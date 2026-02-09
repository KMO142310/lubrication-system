'use client';

import { useState, useEffect } from 'react';
import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLubricationPoints } from '@/hooks/useLubricationPoints';
import { useRoutes } from '@/hooks/useRoutes';
import type { RoutePoint } from '@/types/route';

interface RoutePointsManagerProps {
  routeId: string;
  onPointsChange?: () => void;
}

export function RoutePointsManager({ routeId, onPointsChange }: RoutePointsManagerProps) {
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPointId, setSelectedPointId] = useState<string>('');
  const { lubricationPoints } = useLubricationPoints();
  const { fetchRoutePoints, addPointToRoute, removePointFromRoute, reorderPoints } = useRoutes();

  const loadRoutePoints = async () => {
    try {
      setLoading(true);
      const points = await fetchRoutePoints(routeId);
      setRoutePoints(points);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al cargar puntos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutePoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  const availablePoints = lubricationPoints.filter(
    (lp) => !routePoints.some((rp) => rp.lubrication_point_id === lp.id)
  );

  const handleAddPoint = async () => {
    if (!selectedPointId) {
      toast.error('Selecciona un punto para agregar');
      return;
    }

    try {
      const nextOrderIndex = routePoints.length;
      await addPointToRoute(routeId, selectedPointId, nextOrderIndex);
      await loadRoutePoints();
      setSelectedPointId('');
      toast.success('Punto agregado a la ruta');
      onPointsChange?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al agregar punto');
    }
  };

  const handleRemovePoint = async (routePointId: string) => {
    if (!confirm('¿Estás seguro de quitar este punto de la ruta?')) {
      return;
    }

    try {
      await removePointFromRoute(routePointId);
      await loadRoutePoints();
      toast.success('Punto quitado de la ruta');
      onPointsChange?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al quitar punto');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newPoints = [...routePoints];
    [newPoints[index - 1], newPoints[index]] = [newPoints[index], newPoints[index - 1]];

    const updates = newPoints.map((point, idx) => ({
      id: point.id,
      order_index: idx,
    }));

    try {
      await reorderPoints(updates);
      await loadRoutePoints();
      toast.success('Orden actualizado');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al reordenar');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === routePoints.length - 1) return;

    const newPoints = [...routePoints];
    [newPoints[index], newPoints[index + 1]] = [newPoints[index + 1], newPoints[index]];

    const updates = newPoints.map((point, idx) => ({
      id: point.id,
      order_index: idx,
    }));

    try {
      await reorderPoints(updates);
      await loadRoutePoints();
      toast.success('Orden actualizado');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al reordenar');
    }
  };

  if (loading) {
    return <p className="text-fog">Cargando puntos...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={selectedPointId} onValueChange={setSelectedPointId}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Seleccionar punto para agregar" />
          </SelectTrigger>
          <SelectContent>
            {availablePoints.map((point) => (
              <SelectItem key={point.id} value={point.id}>
                {point.code} - {point.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAddPoint} className="gap-2">
          <Plus className="w-4 h-4" />
          Agregar Punto
        </Button>
      </div>

      {routePoints.length === 0 ? (
        <div className="rounded-sm border border-slate-panel bg-slate-panel/30 p-8 text-center">
          <p className="text-fog">No hay puntos asignados a esta ruta</p>
        </div>
      ) : (
        <div className="space-y-2">
          {routePoints.map((point, index) => (
            <div
              key={point.id}
              className="flex items-center gap-3 p-3 rounded-sm border border-slate-panel bg-slate-panel/30"
            >
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="h-6 w-6 hover:bg-machinery/10 hover:text-machinery"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === routePoints.length - 1}
                  className="h-6 w-6 hover:bg-machinery/10 hover:text-machinery"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-fog">Orden</p>
                  <p className="text-white font-mono font-bold">{index + 1}</p>
                </div>
                <div>
                  <p className="text-xs text-fog">Código</p>
                  <p className="text-white font-mono">{point.point_code}</p>
                </div>
                <div>
                  <p className="text-xs text-fog">Nombre</p>
                  <p className="text-white">{point.point_name}</p>
                </div>
                <div>
                  <p className="text-xs text-fog">Máquina</p>
                  <p className="text-white">{point.machine_name || '—'}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemovePoint(point.id)}
                className="hover:bg-alert-red/10 hover:text-alert-red"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
