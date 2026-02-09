import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCompanyId } from '@/lib/supabase/getCompanyId';
import type { Machine } from '@/types/machine';

export function useMachines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchMachines = async () => {
    try {
      setLoading(true);
      setError(null);

      const companyId = await getCompanyId();

      const { data, error: fetchError } = await supabase
        .from('machines')
        .select(`
          *,
          areas (
            name
          )
        `)
        .eq('company_id', companyId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const machinesWithAreaName = (data || []).map((machine: any) => ({
        ...machine,
        area_name: machine.areas?.name || null,
      }));

      setMachines(machinesWithAreaName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar máquinas');
    } finally {
      setLoading(false);
    }
  };

  const createMachine = async (machine: Omit<Machine, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'company_id' | 'area_name'>) => {
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
        .from('machines')
        .insert([{ ...machine, company_id: userData.company_id }])
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchMachines();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear máquina';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateMachine = async (id: string, machine: Partial<Omit<Machine, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'company_id' | 'area_name'>>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('machines')
        .update(machine)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchMachines();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar máquina';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteMachine = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('machines')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchMachines();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar máquina';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchMachines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    machines,
    loading,
    error,
    fetchMachines,
    createMachine,
    updateMachine,
    deleteMachine,
  };
}
