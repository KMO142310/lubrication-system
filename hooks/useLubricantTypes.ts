import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCompanyId } from '@/lib/supabase/getCompanyId';
import type { LubricantType } from '@/types/lubricant-type';

export function useLubricantTypes() {
  const [lubricantTypes, setLubricantTypes] = useState<LubricantType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchLubricantTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const companyId = await getCompanyId();

      const { data, error: fetchError } = await supabase
        .from('lubricant_types')
        .select('*')
        .eq('company_id', companyId)
        .is('deleted_at', null)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      setLubricantTypes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar lubricantes');
    } finally {
      setLoading(false);
    }
  };

  const createLubricantType = async (lubricantType: Omit<LubricantType, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'company_id'>) => {
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
        .from('lubricant_types')
        .insert([{ ...lubricantType, company_id: userData.company_id }])
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchLubricantTypes();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear lubricante';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateLubricantType = async (id: string, lubricantType: Partial<Omit<LubricantType, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'company_id'>>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('lubricant_types')
        .update(lubricantType)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchLubricantTypes();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar lubricante';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteLubricantType = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('lubricant_types')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchLubricantTypes();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar lubricante';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchLubricantTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    lubricantTypes,
    loading,
    error,
    fetchLubricantTypes,
    createLubricantType,
    updateLubricantType,
    deleteLubricantType,
  };
}
