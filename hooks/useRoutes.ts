import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCompanyId } from '@/lib/supabase/getCompanyId';
import type { Route, RoutePoint } from '@/types/route';

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);

      const companyId = await getCompanyId();

      const { data, error: fetchError } = await supabase
        .from('routes')
        .select(`
          *,
          route_points (count)
        `)
        .eq('company_id', companyId)
        .is('deleted_at', null)
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const routesWithCount = (data || []).map((route: any) => ({
        ...route,
        points_count: route.route_points?.[0]?.count || 0,
      }));

      setRoutes(routesWithCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar rutas');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutePoints = async (routeId: string): Promise<RoutePoint[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('route_points')
        .select(`
          *,
          lubrication_points (
            name,
            code,
            machines (
              name
            )
          )
        `)
        .eq('route_id', routeId)
        .is('deleted_at', null)
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data || []).map((rp: any) => ({
        ...rp,
        point_name: rp.lubrication_points?.name || null,
        point_code: rp.lubrication_points?.code || null,
        machine_name: rp.lubrication_points?.machines?.name || null,
      }));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al cargar puntos de la ruta');
    }
  };

  const createRoute = async (route: Omit<Route, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'company_id' | 'points_count'>) => {
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
        .from('routes')
        .insert([{ ...route, company_id: userData.company_id }])
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchRoutes();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear ruta';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateRoute = async (id: string, route: Partial<Omit<Route, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'company_id' | 'points_count'>>) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('routes')
        .update(route)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchRoutes();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar ruta';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteRoute = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('routes')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchRoutes();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar ruta';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addPointToRoute = async (routeId: string, lubricationPointId: string, orderIndex: number, specialInstructions?: string) => {
    try {
      const { error: insertError } = await supabase
        .from('route_points')
        .insert([{
          route_id: routeId,
          lubrication_point_id: lubricationPointId,
          order_index: orderIndex,
          special_instructions: specialInstructions || null,
        }]);

      if (insertError) throw insertError;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al agregar punto a la ruta');
    }
  };

  const removePointFromRoute = async (routePointId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('route_points')
        .delete()
        .eq('id', routePointId);

      if (deleteError) throw deleteError;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al quitar punto de la ruta');
    }
  };

  const reorderPoints = async (updates: { id: string; order_index: number }[]) => {
    try {
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('route_points')
          .update({ order_index: update.order_index })
          .eq('id', update.id);

        if (updateError) throw updateError;
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al reordenar puntos');
    }
  };

  useEffect(() => {
    fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    routes,
    loading,
    error,
    fetchRoutes,
    fetchRoutePoints,
    createRoute,
    updateRoute,
    deleteRoute,
    addPointToRoute,
    removePointFromRoute,
    reorderPoints,
  };
}
