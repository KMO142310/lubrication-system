'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useInventory } from '@/hooks/useInventory';
import { InventoryTable } from '@/components/supervisor/InventoryTable';
import { StockAdjustmentForm } from '@/components/supervisor/StockAdjustmentForm';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Inventory, InventoryMovement } from '@/types/inventory';

const movementTypeLabels: Record<string, string> = {
  entry: 'Entrada',
  consumption: 'Consumo',
  adjustment: 'Ajuste',
  waste: 'Merma',
};

export default function InventoryPage() {
  const { inventory, loading, error, registerMovement, fetchMovements } = useInventory();
  const [statusFilter, setStatusFilter] = useState('all');
  const [adjustItem, setAdjustItem] = useState<Inventory | null>(null);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [movementsItem, setMovementsItem] = useState<Inventory | null>(null);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);

  const lowStockCount = inventory.filter(
    (item) => item.current_stock_ml <= item.minimum_stock_ml
  ).length;

  const filteredInventory = inventory.filter((item) => {
    if (statusFilter === 'ok') return item.current_stock_ml > item.minimum_stock_ml;
    if (statusFilter === 'low') return item.current_stock_ml <= item.minimum_stock_ml;
    return true;
  });

  const handleAdjustStock = (item: Inventory) => {
    setAdjustItem(item);
    setIsAdjustOpen(true);
  };

  const handleViewMovements = async (item: Inventory) => {
    setMovementsItem(item);
    setLoadingMovements(true);
    try {
      const movs = await fetchMovements(item.id);
      setMovements(movs);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al cargar movimientos');
    } finally {
      setLoadingMovements(false);
    }
  };

  const handleAdjustSubmit = async (data: { type: 'entry' | 'consumption' | 'adjustment' | 'waste'; quantity_ml: number; notes?: string }) => {
    if (!adjustItem) return;

    try {
      await registerMovement({
        inventory_id: adjustItem.id,
        type: data.type,
        quantity_ml: data.quantity_ml,
        notes: data.notes,
      });
      toast.success('Movimiento registrado correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al registrar movimiento');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Cargando inventario...</p>
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
          <h1 className="text-3xl font-bold text-white">Inventario de Lubricantes</h1>
          <p className="text-fog mt-1">
            Control de stock y movimientos de lubricantes
          </p>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div
          className="flex items-center gap-3 p-4 rounded-sm"
          style={{
            backgroundColor: 'rgba(229, 62, 62, 0.1)',
            border: '1px solid rgba(229, 62, 62, 0.3)',
          }}
        >
          <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: '#E53E3E' }} />
          <p className="font-bold" style={{ color: '#E53E3E', fontSize: '16px' }}>
            {lowStockCount} lubricante{lowStockCount > 1 ? 's' : ''} con stock bajo
          </p>
        </div>
      )}

      <div className="flex items-end gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-fog">Estado</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ok">OK</SelectItem>
              <SelectItem value="low">Stock Bajo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <InventoryTable
        inventory={filteredInventory}
        onAdjustStock={handleAdjustStock}
        onViewMovements={handleViewMovements}
      />

      <StockAdjustmentForm
        open={isAdjustOpen}
        onOpenChange={setIsAdjustOpen}
        onSubmit={handleAdjustSubmit}
        item={adjustItem}
      />

      {/* Movements Dialog */}
      <Dialog open={!!movementsItem} onOpenChange={(open) => { if (!open) setMovementsItem(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Movimientos — {movementsItem?.lubricant_name}</DialogTitle>
          </DialogHeader>

          {loadingMovements ? (
            <p className="text-fog">Cargando movimientos...</p>
          ) : movements.length === 0 ? (
            <p className="text-fog text-center py-8">Sin movimientos registrados</p>
          ) : (
            <div className="space-y-2">
              {movements.map((mov) => (
                <div
                  key={mov.id}
                  className="flex items-center justify-between p-3 rounded-sm border border-slate-panel bg-carbon/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={mov.type === 'entry' ? 'success' : mov.type === 'waste' ? 'destructive' : 'secondary'}
                      >
                        {movementTypeLabels[mov.type] || mov.type}
                      </Badge>
                      <span className="text-fog text-sm">
                        {new Date(mov.created_at).toLocaleString('es-CL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {mov.notes && <p className="text-fog text-sm">{mov.notes}</p>}
                    {mov.performed_by_name && (
                      <p className="text-fog text-xs">Por: {mov.performed_by_name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono font-bold">
                      {mov.type === 'entry' ? '+' : '-'}{mov.quantity_ml.toLocaleString()} ml
                    </p>
                    <p className="text-fog text-xs font-mono">
                      {mov.previous_stock_ml.toLocaleString()} → {mov.new_stock_ml.toLocaleString()} ml
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
