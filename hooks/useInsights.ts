import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCompanyId } from '@/lib/supabase/getCompanyId';

interface AvgTimePerPoint {
  point_id: string;
  point_name: string;
  machine_name: string;
  avg_seconds: number;
  count: number;
}

interface TopIncidentMachine {
  machine_id: string;
  machine_name: string;
  area_name: string;
  total: number;
  by_type: Record<string, number>;
}

interface ConsumptionItem {
  lubricant_name: string;
  real_ml: number;
  planned_ml: number;
  difference_pct: number;
}

interface SkippedPoint {
  point_id: string;
  point_name: string;
  machine_name: string;
  skip_count: number;
  total_count: number;
  skip_rate: number;
}

interface LubricatorPerformance {
  user_id: string;
  full_name: string;
  completed_orders: number;
  total_orders: number;
  compliance_rate: number;
  avg_time_minutes: number;
}

export function useInsights() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const getDateRange = (days: number) => {
    const from = new Date();
    from.setDate(from.getDate() - days);
    return from.toISOString();
  };

  const avgTimePerPoint = async (): Promise<AvgTimePerPoint[]> => {
    try {
      const fromDate = getDateRange(30);

      const { data, error } = await supabase
        .from('task_executions')
        .select(`
          duration_seconds,
          lubrication_point_id,
          lubrication_points (
            name,
            machines (
              name
            )
          )
        `)
        .not('duration_seconds', 'is', null)
        .gte('executed_at', fromDate);

      if (error) throw error;

      const grouped: Record<string, { point_name: string; machine_name: string; total_seconds: number; count: number }> = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const item of (data || []) as any[]) {
        const pid = item.lubrication_point_id;
        if (!pid || !item.duration_seconds) continue;

        if (!grouped[pid]) {
          grouped[pid] = {
            point_name: item.lubrication_points?.name || '—',
            machine_name: item.lubrication_points?.machines?.name || '—',
            total_seconds: 0,
            count: 0,
          };
        }
        grouped[pid].total_seconds += item.duration_seconds;
        grouped[pid].count++;
      }

      return Object.entries(grouped).map(([point_id, stats]) => ({
        point_id,
        point_name: stats.point_name,
        machine_name: stats.machine_name,
        avg_seconds: Math.round(stats.total_seconds / stats.count),
        count: stats.count,
      }));
    } catch (err) {
      console.error('Error avgTimePerPoint:', err);
      return [];
    }
  };

  const completionRate = async (days: number): Promise<number> => {
    try {
      const from = new Date();
      from.setDate(from.getDate() - days);
      const fromDate = from.toISOString().split('T')[0];

      const companyId = await getCompanyId();

      const { count: total } = await supabase
        .from('work_orders')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('scheduled_date', fromDate)
        .is('deleted_at', null)
        .not('status', 'eq', 'cancelled');

      const { count: completed } = await supabase
        .from('work_orders')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('scheduled_date', fromDate)
        .eq('status', 'completed')
        .is('deleted_at', null);

      if (!total || total === 0) return 0;
      return Math.round(((completed || 0) / total) * 100);
    } catch (err) {
      console.error('Error completionRate:', err);
      return 0;
    }
  };

  const topIncidentMachines = async (limit: number = 10): Promise<TopIncidentMachine[]> => {
    try {
      const fromDate = getDateRange(30);

      const companyId = await getCompanyId();

      const { data, error } = await supabase
        .from('incidents')
        .select(`
          type,
          lubrication_points (
            machines (
              id,
              name,
              areas (
                name
              )
            )
          )
        `)
        .eq('company_id', companyId)
        .gte('created_at', fromDate)
        .is('deleted_at', null);

      if (error) throw error;

      const grouped: Record<string, { machine_name: string; area_name: string; total: number; by_type: Record<string, number> }> = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const inc of (data || []) as any[]) {
        const machine = inc.lubrication_points?.machines;
        if (!machine?.id) continue;

        const mid = machine.id;
        if (!grouped[mid]) {
          grouped[mid] = {
            machine_name: machine.name || '—',
            area_name: machine.areas?.name || '—',
            total: 0,
            by_type: {},
          };
        }
        grouped[mid].total++;
        const t = inc.type || 'other';
        grouped[mid].by_type[t] = (grouped[mid].by_type[t] || 0) + 1;
      }

      return Object.entries(grouped)
        .map(([machine_id, stats]) => ({
          machine_id,
          ...stats,
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);
    } catch (err) {
      console.error('Error topIncidentMachines:', err);
      return [];
    }
  };

  const consumptionAnalysis = async (): Promise<ConsumptionItem[]> => {
    try {
      const fromDate = getDateRange(30);

      const { data, error } = await supabase
        .from('task_executions')
        .select(`
          lubricant_used_ml,
          lubrication_points (
            quantity_ml,
            lubricant_types (
              name
            )
          )
        `)
        .gte('executed_at', fromDate)
        .eq('status', 'completed');

      if (error) throw error;

      const grouped: Record<string, { real: number; planned: number }> = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const task of (data || []) as any[]) {
        const lubName = task.lubrication_points?.lubricant_types?.name;
        if (!lubName) continue;

        if (!grouped[lubName]) {
          grouped[lubName] = { real: 0, planned: 0 };
        }
        grouped[lubName].real += task.lubricant_used_ml || 0;
        grouped[lubName].planned += task.lubrication_points?.quantity_ml || 0;
      }

      return Object.entries(grouped).map(([lubricant_name, stats]) => ({
        lubricant_name,
        real_ml: Math.round(stats.real),
        planned_ml: Math.round(stats.planned),
        difference_pct: stats.planned > 0
          ? Math.round(((stats.real - stats.planned) / stats.planned) * 100)
          : 0,
      }));
    } catch (err) {
      console.error('Error consumptionAnalysis:', err);
      return [];
    }
  };

  const skippedPoints = async (): Promise<SkippedPoint[]> => {
    try {
      const fromDate = getDateRange(30);

      const { data, error } = await supabase
        .from('task_executions')
        .select(`
          status,
          lubrication_point_id,
          lubrication_points (
            name,
            machines (
              name
            )
          )
        `)
        .gte('created_at', fromDate);

      if (error) throw error;

      const grouped: Record<string, { point_name: string; machine_name: string; skipped: number; total: number }> = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const task of (data || []) as any[]) {
        const pid = task.lubrication_point_id;
        if (!pid) continue;

        if (!grouped[pid]) {
          grouped[pid] = {
            point_name: task.lubrication_points?.name || '—',
            machine_name: task.lubrication_points?.machines?.name || '—',
            skipped: 0,
            total: 0,
          };
        }
        grouped[pid].total++;
        if (task.status === 'skipped') {
          grouped[pid].skipped++;
        }
      }

      return Object.entries(grouped)
        .filter(([, stats]) => stats.skipped > 0)
        .map(([point_id, stats]) => ({
          point_id,
          point_name: stats.point_name,
          machine_name: stats.machine_name,
          skip_count: stats.skipped,
          total_count: stats.total,
          skip_rate: Math.round((stats.skipped / stats.total) * 100),
        }))
        .sort((a, b) => b.skip_count - a.skip_count);
    } catch (err) {
      console.error('Error skippedPoints:', err);
      return [];
    }
  };

  const lubricatorPerformance = async (): Promise<LubricatorPerformance[]> => {
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
      const fromDateStr = fromDate.toISOString().split('T')[0];

      const companyId = await getCompanyId();

      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          id,
          status,
          started_at,
          completed_at,
          assigned_to,
          assigned_to_user:users!work_orders_assigned_to_fkey (
            full_name
          )
        `)
        .eq('company_id', companyId)
        .gte('scheduled_date', fromDateStr)
        .is('deleted_at', null)
        .not('status', 'eq', 'cancelled');

      if (error) throw error;

      const grouped: Record<string, {
        full_name: string;
        completed: number;
        total: number;
        total_minutes: number;
        timed_count: number;
      }> = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const wo of (data || []) as any[]) {
        const uid = wo.assigned_to;
        if (!uid) continue;

        if (!grouped[uid]) {
          grouped[uid] = {
            full_name: wo.assigned_to_user?.full_name || '—',
            completed: 0,
            total: 0,
            total_minutes: 0,
            timed_count: 0,
          };
        }
        grouped[uid].total++;
        if (wo.status === 'completed') {
          grouped[uid].completed++;
          if (wo.started_at && wo.completed_at) {
            const mins = (new Date(wo.completed_at).getTime() - new Date(wo.started_at).getTime()) / 60000;
            if (mins > 0 && mins < 480) {
              grouped[uid].total_minutes += mins;
              grouped[uid].timed_count++;
            }
          }
        }
      }

      return Object.entries(grouped)
        .map(([user_id, stats]) => ({
          user_id,
          full_name: stats.full_name,
          completed_orders: stats.completed,
          total_orders: stats.total,
          compliance_rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
          avg_time_minutes: stats.timed_count > 0 ? Math.round(stats.total_minutes / stats.timed_count) : 0,
        }))
        .sort((a, b) => b.compliance_rate - a.compliance_rate);
    } catch (err) {
      console.error('Error lubricatorPerformance:', err);
      return [];
    }
  };

  return {
    loading,
    setLoading,
    avgTimePerPoint,
    completionRate,
    topIncidentMachines,
    consumptionAnalysis,
    skippedPoints,
    lubricatorPerformance,
  };
}
