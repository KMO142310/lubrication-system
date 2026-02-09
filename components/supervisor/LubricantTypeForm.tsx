'use client';

import { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { LubricantType } from '@/types/lubricant-type';

const lubricantTypeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.enum(['grease', 'oil', 'spray', 'paste', 'other']).nullable(),
  viscosity: z.string().optional(),
  application: z.string().optional(),
  storage_temp_min: z.number().optional().nullable(),
  storage_temp_max: z.number().optional().nullable(),
});

type LubricantTypeFormData = z.infer<typeof lubricantTypeSchema>;

interface LubricantTypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LubricantTypeFormData) => Promise<void>;
  lubricantType?: LubricantType | null;
}

export function LubricantTypeForm({ open, onOpenChange, onSubmit, lubricantType }: LubricantTypeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LubricantTypeFormData>({
    resolver: zodResolver(lubricantTypeSchema),
    defaultValues: {
      name: '',
      category: null,
      viscosity: '',
      application: '',
      storage_temp_min: null,
      storage_temp_max: null,
    },
  });

  useEffect(() => {
    if (lubricantType) {
      reset({
        name: lubricantType.name,
        category: lubricantType.category,
        viscosity: lubricantType.viscosity || '',
        application: lubricantType.application || '',
        storage_temp_min: lubricantType.storage_temp_min,
        storage_temp_max: lubricantType.storage_temp_max,
      });
    } else {
      reset({
        name: '',
        category: null,
        viscosity: '',
        application: '',
        storage_temp_min: null,
        storage_temp_max: null,
      });
    }
  }, [lubricantType, reset]);

  const handleFormSubmit = async (data: LubricantTypeFormData) => {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lubricantType ? 'Editar Lubricante' : 'Nuevo Lubricante'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Shell Gadus S2 V220"
            />
            {errors.name && (
              <p className="text-sm text-alert-red">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grease">Grasa</SelectItem>
                      <SelectItem value="oil">Aceite</SelectItem>
                      <SelectItem value="spray">Spray</SelectItem>
                      <SelectItem value="paste">Pasta</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="viscosity">Viscosidad</Label>
              <Input
                id="viscosity"
                {...register('viscosity')}
                placeholder="NLGI 2 o ISO VG 220"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="application">Aplicación</Label>
            <Textarea
              id="application"
              {...register('application')}
              placeholder="Descripción de para qué se usa este lubricante"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storage_temp_min">Temp. Mínima (°C)</Label>
              <Input
                id="storage_temp_min"
                type="number"
                {...register('storage_temp_min', { valueAsNumber: true })}
                placeholder="-20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage_temp_max">Temp. Máxima (°C)</Label>
              <Input
                id="storage_temp_max"
                type="number"
                {...register('storage_temp_max', { valueAsNumber: true })}
                placeholder="60"
              />
            </div>
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
              {isSubmitting ? 'Guardando...' : lubricantType ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
