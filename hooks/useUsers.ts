import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCompanyId } from '@/lib/supabase/getCompanyId';
import type { User } from '@/types/user';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const companyId = await getCompanyId();

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .is('deleted_at', null)
        .order('full_name', { ascending: true });

      if (fetchError) throw fetchError;

      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    full_name: string;
    role: 'admin' | 'supervisor' | 'lubricator';
    rut?: string;
    phone?: string;
  }) => {
    try {
      setError(null);

      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Usuario no autenticado');

      const { data: currentUserData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', currentUser.user.id)
        .single();

      if (!currentUserData?.company_id) throw new Error('Usuario sin empresa asignada');

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Error al crear usuario en Auth');

      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          company_id: currentUserData.company_id,
          full_name: userData.full_name,
          role: userData.role,
          rut: userData.rut || null,
          phone: userData.phone || null,
          is_active: true,
          avatar_url: null,
          skills: null,
        }]);

      if (insertError) throw insertError;

      await fetchUsers();
      return authData.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateUser = async (id: string, userData: Partial<Omit<User, 'id' | 'company_id' | 'created_at' | 'updated_at' | 'deleted_at'>>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchUsers();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deactivateUser = async (id: string) => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al desactivar usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const activateUser = async (id: string) => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('users')
        .update({ is_active: true })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al activar usuario';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deactivateUser,
    activateUser,
  };
}
