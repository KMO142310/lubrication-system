/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from './supabase';
import { dataService } from './data';

// ============================================================
// DATA PROVIDER - Híbrido Supabase + localStorage
// Usa Supabase si está disponible, sino localStorage
// ============================================================

interface Task {
  id: string;
  lubricationPointId: string;
  scheduledDate: string;
  status: 'pendiente' | 'completado' | 'omitido';
  quantityUsed?: number;
  photoUrl?: string;
  observations?: string;
  completedAt?: string;
  completedBy?: string;
  // Datos relacionados
  lubricationPoint: {
    id: string;
    code: string;
    description: string;
    quantity: number;
  };
  component: {
    id: string;
    name: string;
  };
  machine: {
    id: string;
    name: string;
  };
  area: {
    id: string;
    name: string;
  };
  lubricant: {
    id: string;
    name: string;
    type: string;
  };
  frequency: {
    id: string;
    name: string;
    days: number;
  };
}

interface Stats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  openAnomalies: number;
  compliance: number;
}

interface DataContextType {
  isSupabaseConnected: boolean;
  isLoading: boolean;
  tasks: Task[];
  stats: Stats;
  refreshTasks: () => Promise<void>;
  completeTask: (taskId: string, data: { quantityUsed?: number; photoUrl?: string; observations?: string }) => Promise<boolean>;
  skipTask: (taskId: string, reason: string) => Promise<boolean>;
  refreshStats: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    openAnomalies: 0,
    compliance: 0
  });

  // Verificar conexión a Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('frequencies').select('id').limit(1);
        setIsSupabaseConnected(!error);
      } catch {
        setIsSupabaseConnected(false);
      }
      setIsLoading(false);
    };
    checkConnection();
  }, []);

  // Cargar tareas
  const refreshTasks = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];

    if (isSupabaseConnected) {
      // Usar Supabase
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          scheduled_date,
          status,
          quantity_used,
          photo_url,
          observations,
          completed_at,
          completed_by,
          lubrication_point:lubrication_points(
            id, code, description, quantity,
            component:components(
              id, name,
              machine:machines(
                id, name,
                area:areas(id, name)
              )
            ),
            lubricant:lubricants(id, name, type),
            frequency:frequencies(id, name, days)
          )
        `)
        .eq('scheduled_date', today)
        .order('created_at');

      if (!error && data) {
        const mappedTasks: Task[] = data.map((t: any) => ({
          id: t.id,
          lubricationPointId: t.lubrication_point?.id || '',
          scheduledDate: t.scheduled_date,
          status: t.status,
          quantityUsed: t.quantity_used,
          photoUrl: t.photo_url,
          observations: t.observations,
          completedAt: t.completed_at,
          completedBy: t.completed_by,
          lubricationPoint: {
            id: t.lubrication_point?.id || '',
            code: t.lubrication_point?.code || '',
            description: t.lubrication_point?.description || '',
            quantity: t.lubrication_point?.quantity || 0
          },
          component: {
            id: t.lubrication_point?.component?.id || '',
            name: t.lubrication_point?.component?.name || ''
          },
          machine: {
            id: t.lubrication_point?.component?.machine?.id || '',
            name: t.lubrication_point?.component?.machine?.name || ''
          },
          area: {
            id: t.lubrication_point?.component?.machine?.area?.id || '',
            name: t.lubrication_point?.component?.machine?.area?.name || ''
          },
          lubricant: {
            id: t.lubrication_point?.lubricant?.id || '',
            name: t.lubrication_point?.lubricant?.name || '',
            type: t.lubrication_point?.lubricant?.type || 'grasa'
          },
          frequency: {
            id: t.lubrication_point?.frequency?.id || '',
            name: t.lubrication_point?.frequency?.name || '',
            days: t.lubrication_point?.frequency?.days || 1
          }
        }));
        setTasks(mappedTasks);
      }
    } else {
      // Usar localStorage (fallback)
      const todayWO = dataService.getTodayWorkOrder();
      const allTasks = todayWO ? dataService.getTasks(todayWO.id) : [];
      const points = dataService.getLubricationPoints();
      const components = dataService.getComponents();
      const machines = dataService.getMachines();
      const areas = dataService.getAreas();
      const lubricants = dataService.getLubricants();
      const frequencies = dataService.getFrequencies();

      const localTasks = allTasks.map((t: any) => {
        const point = points.find((p: any) => p.id === t.lubricationPointId);
        const component = components.find((c: any) => c.id === point?.componentId);
        const machine = machines.find((m: any) => m.id === component?.machineId);
        const area = areas.find((a: any) => a.id === machine?.areaId);
        const lubricant = lubricants.find((l: any) => l.id === point?.lubricantId);
        const frequency = frequencies.find((f: any) => f.id === point?.frequencyId);
        return { ...t, lubricationPoint: point, component, machine, area, lubricant, frequency };
      });

      const mappedTasks: Task[] = localTasks.map((t: any) => ({
        id: t.id,
        lubricationPointId: t.lubricationPoint?.id || '',
        scheduledDate: today,
        status: t.status,
        quantityUsed: t.quantityUsed,
        photoUrl: t.photoUrl,
        observations: t.observations,
        completedAt: t.completedAt,
        completedBy: t.completedBy,
        lubricationPoint: {
          id: t.lubricationPoint?.id || '',
          code: t.lubricationPoint?.code || '',
          description: t.lubricationPoint?.description || '',
          quantity: t.lubricationPoint?.quantity || 0
        },
        component: {
          id: t.component?.id || '',
          name: t.component?.name || ''
        },
        machine: {
          id: t.machine?.id || '',
          name: t.machine?.name || ''
        },
        area: {
          id: t.area?.id || '',
          name: t.area?.name || ''
        },
        lubricant: {
          id: t.lubricant?.id || '',
          name: t.lubricant?.name || '',
          type: t.lubricant?.type || 'grasa'
        },
        frequency: {
          id: t.frequency?.id || '',
          name: t.frequency?.name || '',
          days: t.frequency?.days || 1
        }
      }));
      setTasks(mappedTasks);
    }
  }, [isSupabaseConnected]);

  // Completar tarea
  const completeTask = async (taskId: string, data: { quantityUsed?: number; photoUrl?: string; observations?: string }): Promise<boolean> => {
    if (isSupabaseConnected) {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: 'completado',
          quantity_used: data.quantityUsed,
          photo_url: data.photoUrl,
          observations: data.observations,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (!error) {
        await refreshTasks();
        await refreshStats();
        return true;
      }
      return false;
    } else {
      // Fallback localStorage
      dataService.updateTask(taskId, {
        status: 'completado',
        quantityUsed: data.quantityUsed,
        observations: data.observations,
        completedAt: new Date().toISOString()
      });
      await refreshTasks();
      await refreshStats();
      return true;
    }
  };

  // Omitir tarea
  const skipTask = async (taskId: string, reason: string): Promise<boolean> => {
    if (isSupabaseConnected) {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: 'omitido',
          observations: reason
        })
        .eq('id', taskId);

      if (!error) {
        await refreshTasks();
        return true;
      }
      return false;
    } else {
      dataService.updateTask(taskId, {
        status: 'omitido',
        observations: reason
      });
      await refreshTasks();
      return true;
    }
  };

  // Cargar estadísticas
  const refreshStats = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];

    if (isSupabaseConnected) {
      const [
        { count: total },
        { count: completed },
        { count: pending },
        { count: anomalies }
      ] = await Promise.all([
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('scheduled_date', today),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('scheduled_date', today).eq('status', 'completado'),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('scheduled_date', today).eq('status', 'pendiente'),
        supabase.from('anomalies').select('*', { count: 'exact', head: true }).eq('status', 'abierta')
      ]);

      setStats({
        totalTasks: total || 0,
        completedTasks: completed || 0,
        pendingTasks: pending || 0,
        openAnomalies: anomalies || 0,
        compliance: total && total > 0 ? Math.round(((completed || 0) / total) * 100) : 0
      });
    } else {
      // Calcular stats desde localStorage
      const todayWO = dataService.getTodayWorkOrder();
      const allTasks = todayWO ? dataService.getTasks(todayWO.id) : [];
      const anomalies = dataService.getAnomalies();

      const total = allTasks.length;
      const completed = allTasks.filter((t: any) => t.status === 'completado').length;
      const pending = allTasks.filter((t: any) => t.status === 'pendiente').length;
      const openAnom = anomalies.filter((a: any) => a.status === 'abierta').length;

      setStats({
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending,
        openAnomalies: openAnom,
        compliance: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
  }, [isSupabaseConnected]);

  // Cargar datos iniciales
  useEffect(() => {
    if (!isLoading) {
      refreshTasks();
      refreshStats();
    }
  }, [isLoading, refreshTasks, refreshStats]);

  return (
    <DataContext.Provider value={{
      isSupabaseConnected,
      isLoading,
      tasks,
      stats,
      refreshTasks,
      completeTask,
      skipTask,
      refreshStats
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
