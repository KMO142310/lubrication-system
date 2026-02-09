import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCompanyId } from '@/lib/supabase/getCompanyId';
import type { Inventory, InventoryMovement } from '@/types/inventory';

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const companyId = await getCompanyId();

      const { data, error: fetchError } = await supabase
        .from('inventory')
        .select(`
          *,
          lubricant_types (
            name,
            category
          )
        `)
        .eq('company_id', companyId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inventoryWithNames = (data || []).map((item: any) => ({
        ...item,
        lubricant_name: item.lubricant_types?.name || null,
        lubricant_category: item.lubricant_types?.category || null,
      }));

      setInventory(inventoryWithNames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, newStockMl: number) => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('inventory')
        .update({ current_stock_ml: newStockMl })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchInventory();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar stock';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const registerMovement = async (data: {
    inventory_id: string;
    type: InventoryMovement['type'];
    quantity_ml: number;
    notes?: string;
  }) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      // Obtener stock actual
      const { data: currentItem, error: fetchErr } = await supabase
        .from('inventory')
        .select('current_stock_ml')
        .eq('id', data.inventory_id)
        .single();

      if (fetchErr) throw fetchErr;

      const previousStock = currentItem?.current_stock_ml || 0;
      let newStock: number;

      if (data.type === 'entry') {
        newStock = previousStock + data.quantity_ml;
      } else if (data.type === 'consumption' || data.type === 'waste') {
        newStock = Math.max(0, previousStock - data.quantity_ml);
      } else {
        // adjustment: quantity_ml es el nuevo valor absoluto
        newStock = data.quantity_ml;
      }

      // Insertar movimiento
      const { error: movError } = await supabase
        .from('inventory_movements')
        .insert([{
          inventory_id: data.inventory_id,
          type: data.type,
          quantity_ml: data.quantity_ml,
          previous_stock_ml: previousStock,
          new_stock_ml: newStock,
          performed_by: user.id,
          notes: data.notes || null,
        }]);

      if (movError) throw movError;

      // Actualizar stock
      const updateData: Record<string, unknown> = { current_stock_ml: newStock };
      if (data.type === 'entry') {
        updateData.last_restocked_at = new Date().toISOString();
      }

      const { error: updateErr } = await supabase
        .from('inventory')
        .update(updateData)
        .eq('id', data.inventory_id);

      if (updateErr) throw updateErr;

      await fetchInventory();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar movimiento';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const fetchMovements = async (inventoryId: string): Promise<InventoryMovement[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('inventory_movements')
        .select(`
          *,
          performed_by_user:users!inventory_movements_performed_by_fkey (
            full_name
          )
        `)
        .eq('inventory_id', inventoryId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (fetchError) throw fetchError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data || []).map((mov: any) => ({
        ...mov,
        performed_by_name: mov.performed_by_user?.full_name || null,
      }));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al cargar movimientos');
    }
  };

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    inventory,
    loading,
    error,
    fetchInventory,
    updateStock,
    registerMovement,
    fetchMovements,
  };
}
