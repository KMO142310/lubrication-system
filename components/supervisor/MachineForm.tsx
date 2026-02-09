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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAreas } from '@/hooks/useAreas';
import type { Machine } from '@/types/machine';

const machineSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().min(1, 'El código es requerido'),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional().nullable(),
  area_id: z.string().nullable(),
  status: z.enum(['operational', 'maintenance', 'stopped']).nullable(),
  criticality: z.enum(['critical', 'important', 'standard']).nullable(),
});

type MachineFormData = z.infer<typeof machineSchema>;

interface MachineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MachineFormData) => Promise<void>;
  machine?: Machine | null;
}

export function MachineForm({ open, onOpenChange, onSubmit, machine }: MachineFormProps) {
  const { areas } = useAreas();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MachineFormData>({
    resolver: zodResolver(machineSchema),
    defaultValues: {
      name: '',
      code: '',
      brand: '',
      model: '',
      year: null,
      area_id: null,
      status: null,
      criticality: null,
    },
  });

  useEffect(() => {
    if (machine) {
      reset({
        name: machine.name,
        code: machine.code,
        brand: machine.brand || '',
        model: machine.model || '',
        year: machine.year,
        area_id: machine.area_id,
        status: machine.status,
        criticality: machine.criticality,
      });
    } else {
      reset({
        name: '',
        code: '',
        brand: '',
        model: '',
        year: null,
        area_id: null,
        status: null,
        criticality: null,
      });
    }
  }, [machine, reset]);

  const handleFormSubmit = async (data: MachineFormData) => {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{machine ? 'Editar Máquina' : 'Nueva Máquina'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ej: Sierra Huincha Principal #1"
              />
              {errors.name && (
                <p className="text-sm text-alert-red">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="SH-001"
              />
              {errors.code && (
                <p className="text-sm text-alert-red">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                {...register('brand')}
                placeholder="Ej: Caterpillar"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                {...register('model')}
                placeholder="Ej: D8T"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                {...register('year', { valueAsNumber: true })}
                placeholder="2020"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area_id">Área</Label>
              <Controller
                name="area_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operativa</SelectItem>
                      <SelectItem value="maintenance">En mantención</SelectItem>
                      <SelectItem value="stopped">Detenida</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="criticality">Criticidad</Label>
              <Controller
                name="criticality"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar criticidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Crítica</SelectItem>
                      <SelectItem value="important">Importante</SelectItem>
                      <SelectItem value="standard">Estándar</SelectItem>
                    </SelectContent>
                  </Select>
                )}
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
              {isSubmitting ? 'Guardando...' : machine ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
