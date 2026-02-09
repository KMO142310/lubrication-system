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
import type { Inventory } from '@/types/inventory';

const adjustmentSchema = z.object({
  type: z.enum(['entry', 'consumption', 'adjustment', 'waste']),
  quantity_ml: z.number().min(0.1, 'La cantidad debe ser mayor a 0'),
  notes: z.string().optional(),
});

type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

interface StockAdjustmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AdjustmentFormData) => Promise<void>;
  item: Inventory | null;
}

export function StockAdjustmentForm({ open, onOpenChange, onSubmit, item }: StockAdjustmentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      type: 'entry',
      quantity_ml: 0,
      notes: '',
    },
  });

  useEffect(() => {
    reset({
      type: 'entry',
      quantity_ml: 0,
      notes: '',
    });
  }, [item, reset, open]);

  const handleFormSubmit = async (data: AdjustmentFormData) => {
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
          <DialogTitle>Ajustar Stock</DialogTitle>
        </DialogHeader>

        {item && (
          <div className="p-3 rounded-sm bg-carbon/50 border border-slate-panel space-y-1">
            <p className="text-white font-medium">{item.lubricant_name}</p>
            <p className="text-fog text-sm">
              Stock actual: <span className="text-white font-mono">{item.current_stock_ml.toLocaleString()} ml</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Movimiento *</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entrada</SelectItem>
                    <SelectItem value="consumption">Consumo</SelectItem>
                    <SelectItem value="adjustment">Ajuste</SelectItem>
                    <SelectItem value="waste">Merma</SelectItem>
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
              placeholder="500"
            />
            {errors.quantity_ml && (
              <p className="text-sm text-alert-red">{errors.quantity_ml.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Motivo del movimiento"
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
              {isSubmitting ? 'Registrando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
