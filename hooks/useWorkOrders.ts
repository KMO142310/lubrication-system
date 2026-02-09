import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCompanyId } from '@/lib/supabase/getCompanyId';
import type { WorkOrder, TaskExecution } from '@/types/work-order';

interface WorkOrderFilters {
  scheduled_date?: string;
  assigned_to?: string;
  status?: WorkOrder['status'];
}

interface WorkOrderDetail extends WorkOrder {
  task_executions: TaskExecution[];
}

export function useWorkOrders(filters?: WorkOrderFilters) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchWorkOrders = async (overrideFilters?: WorkOrderFilters) => {
    try {
      setLoading(true);
      setError(null);

      const activeFilters = overrideFilters || filters;

      const companyId = await getCompanyId();

      let query = supabase
        .from('work_orders')
        .select(`
          *,
          routes (
            name
          ),
          assigned_to_user:users!work_orders_assigned_to_fkey (
            full_name
          ),
          assigned_by_user:users!work_orders_assigned_by_fkey (
            full_name
          )
        `)
        .eq('company_id', companyId)
        .is('deleted_at', null)
        .order('scheduled_date', { ascending: false });

      if (activeFilters?.scheduled_date) {
        query = query.eq('scheduled_date', activeFilters.scheduled_date);
      }

      if (activeFilters?.assigned_to) {
        query = query.eq('assigned_to', activeFilters.assigned_to);
      }

      if (activeFilters?.status) {
        query = query.eq('status', activeFilters.status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const workOrdersWithNames = (data || []).map((wo: any) => ({
        ...wo,
        route_name: wo.routes?.name || null,
        assigned_to_name: wo.assigned_to_user?.full_name || null,
        assigned_by_name: wo.assigned_by_user?.full_name || null,
      }));

      setWorkOrders(workOrdersWithNames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar órdenes de trabajo');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkOrderDetail = async (workOrderId: string): Promise<WorkOrderDetail> => {
    try {
      const { data: woData, error: woError } = await supabase
        .from('work_orders')
        .select(`
          *,
          routes (
            name
          ),
          assigned_to_user:users!work_orders_assigned_to_fkey (
            full_name
          ),
          assigned_by_user:users!work_orders_assigned_by_fkey (
            full_name
          )
        `)
        .eq('id', workOrderId)
        .single();

      if (woError) throw woError;

      const { data: teData, error: teError } = await supabase
        .from('task_executions')
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
        .eq('work_order_id', workOrderId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (teError) throw teError;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const taskExecutions: TaskExecution[] = (teData || []).map((te: any) => ({
        ...te,
        point_name: te.lubrication_points?.name || null,
        point_code: te.lubrication_points?.code || null,
        machine_name: te.lubrication_points?.machines?.name || null,
      }));

      return {
        ...woData,
        route_name: woData.routes?.name || null,
        assigned_to_name: woData.assigned_to_user?.full_name || null,
        assigned_by_name: woData.assigned_by_user?.full_name || null,
        task_executions: taskExecutions,
      };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al cargar detalle de OT');
    }
  };

  const createWorkOrder = async (data: {
    route_id: string;
    assigned_to: string;
    scheduled_date: string;
  }) => {
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

      const { data: routePoints, error: rpError } = await supabase
        .from('route_points')
        .select('lubrication_point_id, order_index')
        .eq('route_id', data.route_id)
        .is('deleted_at', null)
        .order('order_index', { ascending: true });

      if (rpError) throw rpError;

      if (!routePoints || routePoints.length === 0) {
        throw new Error('La ruta no tiene puntos asignados');
      }

      const { data: newWO, error: woError } = await supabase
        .from('work_orders')
        .insert([{
          company_id: userData.company_id,
          route_id: data.route_id,
          assigned_to: data.assigned_to,
          assigned_by: user.id,
          scheduled_date: data.scheduled_date,
          status: 'pending',
          completion_percentage: 0,
          notes: null,
          started_at: null,
          completed_at: null,
        }])
        .select()
        .single();

      if (woError) throw woError;

      const taskExecutions = routePoints.map((rp) => ({
        work_order_id: newWO.id,
        lubrication_point_id: rp.lubrication_point_id,
        executed_by: null,
        status: null,
        executed_at: null,
        lubricant_used_ml: null,
        duration_seconds: null,
        notes: null,
        photo_urls: null,
        geolocation: null,
      }));

      const { error: teError } = await supabase
        .from('task_executions')
        .insert(taskExecutions);

      if (teError) throw teError;

      await fetchWorkOrders();
      return newWO;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear orden de trabajo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateWorkOrderStatus = async (id: string, status: NonNullable<WorkOrder['status']>) => {
    try {
      setError(null);

      const updateData: Record<string, unknown> = { status };

      if (status === 'in_progress') {
        updateData.started_at = new Date().toISOString();
      }

      if (status === 'completed' || status === 'incomplete') {
        updateData.completed_at = new Date().toISOString();
        const percentage = await calculateCompletion(id);
        updateData.completion_percentage = percentage;
      }

      const { data, error: updateError } = await supabase
        .from('work_orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchWorkOrders();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar estado de OT';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const cancelWorkOrder = async (id: string) => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('work_orders')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchWorkOrders();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar OT';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const calculateCompletion = async (workOrderId: string): Promise<number> => {
    try {
      const { data: allTasks, error: allError } = await supabase
        .from('task_executions')
        .select('id')
        .eq('work_order_id', workOrderId)
        .is('deleted_at', null);

      if (allError) throw allError;

      const { data: completedTasks, error: completedError } = await supabase
        .from('task_executions')
        .select('id')
        .eq('work_order_id', workOrderId)
        .eq('status', 'completed')
        .is('deleted_at', null);

      if (completedError) throw completedError;

      const total = allTasks?.length || 0;
      const completed = completedTasks?.length || 0;

      if (total === 0) return 0;

      const percentage = Math.round((completed / total) * 100);

      const { error: updateError } = await supabase
        .from('work_orders')
        .update({ completion_percentage: percentage })
        .eq('id', workOrderId);

      if (updateError) throw updateError;

      return percentage;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al calcular completitud');
    }
  };

  useEffect(() => {
    fetchWorkOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    workOrders,
    loading,
    error,
    fetchWorkOrders,
    fetchWorkOrderDetail,
    createWorkOrder,
    updateWorkOrderStatus,
    cancelWorkOrder,
    calculateCompletion,
  };
}
