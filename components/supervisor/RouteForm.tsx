'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import type { Route } from '@/types/route';

const routeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  estimated_duration_min: z.number().optional().nullable(),
  is_active: z.boolean(),
});

type RouteFormData = z.infer<typeof routeSchema>;

interface RouteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RouteFormData) => Promise<void>;
  route?: Route | null;
}

export function RouteForm({ open, onOpenChange, onSubmit, route }: RouteFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      name: '',
      description: '',
      estimated_duration_min: null,
      is_active: true,
    },
  });

  useEffect(() => {
    if (route) {
      reset({
        name: route.name,
        description: route.description || '',
        estimated_duration_min: route.estimated_duration_min,
        is_active: route.is_active,
      });
    } else {
      reset({
        name: '',
        description: '',
        estimated_duration_min: null,
        is_active: true,
      });
    }
  }, [route, reset]);

  const handleFormSubmit = async (data: RouteFormData) => {
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
          <DialogTitle>{route ? 'Editar Ruta' : 'Nueva Ruta'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ruta Matinal Línea 1"
            />
            {errors.name && (
              <p className="text-sm text-alert-red">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descripción de la ruta"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_duration_min">Duración Estimada (minutos)</Label>
            <Input
              id="estimated_duration_min"
              type="number"
              {...register('estimated_duration_min', { valueAsNumber: true })}
              placeholder="60"
            />
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
              {isSubmitting ? 'Guardando...' : route ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
