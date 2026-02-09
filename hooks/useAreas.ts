import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCompanyId } from '@/lib/supabase/getCompanyId';
import type { Area } from '@/types/area';

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchAreas = async () => {
    try {
      setLoading(true);
      setError(null);

      const companyId = await getCompanyId();

      const { data, error: fetchError } = await supabase
        .from('areas')
        .select('*')
        .eq('company_id', companyId)
        .is('deleted_at', null)
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;

      setAreas(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar áreas');
    } finally {
      setLoading(false);
    }
  };

  const createArea = async (area: Omit<Area, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'company_id'>) => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!userData?.company_id) throw new Error('Usuario sin empresa asignada');

      const { data, error: insertError } = await supabase
        .from('areas')
        .insert([{ ...area, company_id: userData.company_id }])
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchAreas();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear área';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateArea = async (id: string, area: Partial<Omit<Area, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'company_id'>>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('areas')
        .update(area)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchAreas();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar área';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteArea = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('areas')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchAreas();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar área';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    areas,
    loading,
    error,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
  };
}
