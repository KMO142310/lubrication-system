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
import { useMachines } from '@/hooks/useMachines';
import { useLubricantTypes } from '@/hooks/useLubricantTypes';
import type { LubricationPoint } from '@/types/lubrication-point';

const lubricationPointSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().min(1, 'El código es requerido'),
  machine_id: z.string().nullable(),
  lubricant_type_id: z.string().nullable(),
  method: z.enum(['manual_grease', 'oil_can', 'automatic', 'spray', 'immersion']).nullable(),
  quantity_ml: z.number().min(0, 'La cantidad debe ser mayor o igual a 0'),
  frequency_type: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'custom']).nullable(),
  frequency_hours: z.number().optional().nullable(),
  location_description: z.string().optional(),
  safety_notes: z.string().optional(),
  is_active: z.boolean(),
});

type LubricationPointFormData = z.infer<typeof lubricationPointSchema>;

interface LubricationPointFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LubricationPointFormData) => Promise<void>;
  lubricationPoint?: LubricationPoint | null;
}

export function LubricationPointForm({ open, onOpenChange, onSubmit, lubricationPoint }: LubricationPointFormProps) {
  const { machines } = useMachines();
  const { lubricantTypes } = useLubricantTypes();
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LubricationPointFormData>({
    resolver: zodResolver(lubricationPointSchema),
    defaultValues: {
      name: '',
      code: '',
      machine_id: null,
      lubricant_type_id: null,
      method: null,
      quantity_ml: 0,
      frequency_type: null,
      frequency_hours: null,
      location_description: '',
      safety_notes: '',
      is_active: true,
    },
  });

  const frequencyType = watch('frequency_type');

  useEffect(() => {
    if (lubricationPoint) {
      reset({
        name: lubricationPoint.name,
        code: lubricationPoint.code,
        machine_id: lubricationPoint.machine_id,
        lubricant_type_id: lubricationPoint.lubricant_type_id,
        method: lubricationPoint.method,
        quantity_ml: lubricationPoint.quantity_ml,
        frequency_type: lubricationPoint.frequency_type,
        frequency_hours: lubricationPoint.frequency_hours,
        location_description: lubricationPoint.location_description || '',
        safety_notes: lubricationPoint.safety_notes || '',
        is_active: lubricationPoint.is_active,
      });
    } else {
      reset({
        name: '',
        code: '',
        machine_id: null,
        lubricant_type_id: null,
        method: null,
        quantity_ml: 0,
        frequency_type: null,
        frequency_hours: null,
        location_description: '',
        safety_notes: '',
        is_active: true,
      });
    }
  }, [lubricationPoint, reset]);

  const handleFormSubmit = async (data: LubricationPointFormData) => {
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lubricationPoint ? 'Editar Punto de Lubricación' : 'Nuevo Punto de Lubricación'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Rodamiento lado motor"
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
                placeholder="SH-001-R01"
              />
              {errors.code && (
                <p className="text-sm text-alert-red">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="machine_id">Máquina</Label>
              <Controller
                name="machine_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar máquina" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines.map((machine) => (
                        <SelectItem key={machine.id} value={machine.id}>
                          {machine.code} - {machine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lubricant_type_id">Lubricante</Label>
              <Controller
                name="lubricant_type_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar lubricante" />
                    </SelectTrigger>
                    <SelectContent>
                      {lubricantTypes.map((lubricant) => (
                        <SelectItem key={lubricant.id} value={lubricant.id}>
                          {lubricant.name}
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
              <Label htmlFor="method">Método</Label>
              <Controller
                name="method"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual_grease">Grasa manual</SelectItem>
                      <SelectItem value="oil_can">Aceitera</SelectItem>
                      <SelectItem value="automatic">Automático</SelectItem>
                      <SelectItem value="spray">Spray</SelectItem>
                      <SelectItem value="immersion">Inmersión</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity_ml">Cantidad (ml) *</Label>
              <Input
                id="quantity_ml"
                type="number"
                step="0.1"
                {...register('quantity_ml', { valueAsNumber: true })}
                placeholder="50"
              />
              {errors.quantity_ml && (
                <p className="text-sm text-alert-red">{errors.quantity_ml.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency_type">Frecuencia</Label>
              <Controller
                name="frequency_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diaria</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="biweekly">Quincenal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {frequencyType === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="frequency_hours">Horas de operación</Label>
                <Input
                  id="frequency_hours"
                  type="number"
                  {...register('frequency_hours', { valueAsNumber: true })}
                  placeholder="100"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location_description">Descripción de ubicación</Label>
            <Textarea
              id="location_description"
              {...register('location_description')}
              placeholder="Lado izquierdo del motor, acceso por puerta lateral"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="safety_notes">Notas de seguridad</Label>
            <Textarea
              id="safety_notes"
              {...register('safety_notes')}
              placeholder="Equipo debe estar detenido"
              rows={2}
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
              {isSubmitting ? 'Guardando...' : lubricationPoint ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
