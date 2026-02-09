'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRoutes } from '@/hooks/useRoutes';
import { useUsers } from '@/hooks/useUsers';
import type { Route } from '@/types/route';

const workOrderSchema = z.object({
  route_id: z.string().min(1, 'La ruta es requerida'),
  assigned_to: z.string().min(1, 'El lubricador es requerido'),
  scheduled_date: z.string().min(1, 'La fecha es requerida'),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

interface WorkOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WorkOrderFormData) => Promise<void>;
}

export function WorkOrderForm({ open, onOpenChange, onSubmit }: WorkOrderFormProps) {
  const { routes } = useRoutes();
  const { users } = useUsers();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const activeRoutes = routes.filter((r) => r.is_active);
  const lubricators = users.filter((u) => u.role === 'lubricator' && u.is_active);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      route_id: '',
      assigned_to: '',
      scheduled_date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        route_id: '',
        assigned_to: '',
        scheduled_date: new Date().toISOString().split('T')[0],
      });
      setSelectedRoute(null);
    }
  }, [open, reset]);

  const handleRouteChange = (routeId: string, onChange: (value: string) => void) => {
    onChange(routeId);
    const route = activeRoutes.find((r) => r.id === routeId);
    setSelectedRoute(route || null);
  };

  const handleFormSubmit = async (data: WorkOrderFormData) => {
    try {
      await onSubmit(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error en formulario:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Orden de Trabajo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="route_id">Ruta *</Label>
            <Controller
              name="route_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(val) => handleRouteChange(val, field.onChange)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ruta" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeRoutes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.route_id && (
              <p className="text-sm text-alert-red">{errors.route_id.message}</p>
            )}
            {selectedRoute && (
              <div className="flex gap-4 p-3 rounded-sm bg-carbon/50 border border-slate-panel">
                <div>
                  <p className="text-xs text-fog">Puntos</p>
                  <p className="text-white font-mono font-bold">{selectedRoute.points_count || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-fog">Duración Est.</p>
                  <p className="text-white font-mono font-bold">
                    {selectedRoute.estimated_duration_min ? `${selectedRoute.estimated_duration_min} min` : '—'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_to">Lubricador *</Label>
            <Controller
              name="assigned_to"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar lubricador" />
                  </SelectTrigger>
                  <SelectContent>
                    {lubricators.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assigned_to && (
              <p className="text-sm text-alert-red">{errors.assigned_to.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled_date">Fecha Programada *</Label>
            <Input
              id="scheduled_date"
              type="date"
              {...register('scheduled_date')}
            />
            {errors.scheduled_date && (
              <p className="text-sm text-alert-red">{errors.scheduled_date.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Orden'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
