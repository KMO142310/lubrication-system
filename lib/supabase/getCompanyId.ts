import { createClient } from '@/lib/supabase/client';

export async function getCompanyId(): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { data, error } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user.id)
    .single();

  if (error || !data?.company_id) throw new Error('Usuario sin empresa asignada');
  return data.company_id;
}
