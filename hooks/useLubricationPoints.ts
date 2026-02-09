import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCompanyId } from '@/lib/supabase/getCompanyId';
import type { LubricationPoint } from '@/types/lubrication-point';

export function useLubricationPoints() {
  const [lubricationPoints, setLubricationPoints] = useState<LubricationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchLubricationPoints = async () => {
    try {
      setLoading(true);
      setError(null);

      const companyId = await getCompanyId();

      const { data, error: fetchError } = await supabase
        .from('lubrication_points')
        .select(`
          *,
          machines (
            name
          ),
          lubricant_types (
            name
          )
        `)
        .eq('company_id', companyId)
        .is('deleted_at', null)
        .order('code', { ascending: true });

      if (fetchError) throw fetchError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pointsWithNames = (data || []).map((point: any) => ({
        ...point,
        machine_name: point.machines?.name || null,
        lubricant_name: point.lubricant_types?.name || null,
      }));

      setLubricationPoints(pointsWithNames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar puntos de lubricación');
    } finally {
      setLoading(false);
    }
  };

  const createLubricationPoint = async (point: Omit<LubricationPoint, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'machine_name' | 'lubricant_name'>) => {
    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('lubrication_points')
        .insert([point])
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchLubricationPoints();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear punto de lubricación';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateLubricationPoint = async (id: string, point: Partial<Omit<LubricationPoint, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'machine_name' | 'lubricant_name'>>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('lubrication_points')
        .update(point)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchLubricationPoints();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar punto de lubricación';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteLubricationPoint = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('lubrication_points')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchLubricationPoints();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar punto de lubricación';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchLubricationPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    lubricationPoints,
    loading,
    error,
    fetchLubricationPoints,
    createLubricationPoint,
    updateLubricationPoint,
    deleteLubricationPoint,
  };
}
