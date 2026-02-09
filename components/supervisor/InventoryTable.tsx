'use client';

import { Sliders, History } from 'lucide-react';
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
import type { Inventory } from '@/types/inventory';

const categoryLabels: Record<string, string> = {
  grease: 'Grasa',
  oil: 'Aceite',
  spray: 'Spray',
  paste: 'Pasta',
  other: 'Otro',
};

interface InventoryTableProps {
  inventory: Inventory[];
  onAdjustStock: (item: Inventory) => void;
  onViewMovements: (item: Inventory) => void;
}

export function InventoryTable({ inventory, onAdjustStock, onViewMovements }: InventoryTableProps) {
  if (inventory.length === 0) {
    return (
      <div className="rounded-sm border border-slate-panel bg-slate-panel/30 p-12 text-center">
        <p className="text-fog text-lg">No hay items de inventario registrados</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-slate-panel overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lubricante</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Stock Actual</TableHead>
            <TableHead>Stock Mínimo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item, index) => {
            const isLow = item.current_stock_ml <= item.minimum_stock_ml;
            return (
              <TableRow
                key={item.id}
                style={{
                  backgroundColor: index % 2 === 0 ? 'rgba(45, 55, 72, 0.3)' : 'transparent',
                }}
              >
                <TableCell className="font-medium text-white">
                  {item.lubricant_name || '—'}
                </TableCell>
                <TableCell className="text-fog">
                  {item.lubricant_category ? categoryLabels[item.lubricant_category] || item.lubricant_category : '—'}
                </TableCell>
                <TableCell className="font-mono" style={{ color: isLow ? '#E53E3E' : '#fff' }}>
                  {item.current_stock_ml.toLocaleString()} ml
                </TableCell>
                <TableCell className="text-fog font-mono">
                  {item.minimum_stock_ml.toLocaleString()} ml
                </TableCell>
                <TableCell>
                  {isLow ? (
                    <Badge variant="destructive">BAJO</Badge>
                  ) : (
                    <Badge variant="success">OK</Badge>
                  )}
                </TableCell>
                <TableCell className="text-fog">
                  {item.location || '—'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onAdjustStock(item)}
                      className="hover:bg-machinery/10 hover:text-machinery"
                      title="Ajustar stock"
                    >
                      <Sliders className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewMovements(item)}
                      className="hover:bg-machinery/10 hover:text-machinery"
                      title="Ver movimientos"
                    >
                      <History className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
