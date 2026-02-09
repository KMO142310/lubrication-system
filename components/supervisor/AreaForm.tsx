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
import type { Area } from '@/types/area';

const areaSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  order_index: z.number().min(0, 'El orden debe ser mayor o igual a 0'),
});

type AreaFormData = z.infer<typeof areaSchema>;

interface AreaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AreaFormData) => Promise<void>;
  area?: Area | null;
}

export function AreaForm({ open, onOpenChange, onSubmit, area }: AreaFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      name: '',
      description: '',
      order_index: 0,
    },
  });

  useEffect(() => {
    if (area) {
      reset({
        name: area.name,
        description: area.description || '',
        order_index: area.order_index,
      });
    } else {
      reset({
        name: '',
        description: '',
        order_index: 0,
      });
    }
  }, [area, reset]);

  const handleFormSubmit = async (data: AreaFormData) => {
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
          <DialogTitle>{area ? 'Editar Área' : 'Nueva Área'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ej: Línea Principal"
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
              placeholder="Descripción o ubicación del área"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-alert-red">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Orden de Recorrido *</Label>
            <Input
              id="order_index"
              type="number"
              {...register('order_index', { valueAsNumber: true })}
              placeholder="0"
            />
            {errors.order_index && (
              <p className="text-sm text-alert-red">{errors.order_index.message}</p>
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
              {isSubmitting ? 'Guardando...' : area ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
