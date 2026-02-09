'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface TodayWorkOrder {
  id: string;
  status: string | null;
  completion_percentage: number | null;
  started_at: string | null;
  completed_at: string | null;
  routes: {
    name: string;
    estimated_duration_min: number | null;
  } | null;
  task_count: number;
  completed_count: number;
}

export default function LubricatorDashboard() {
  const [userName, setUserName] = useState('');
  const [workOrder, setWorkOrder] = useState<TodayWorkOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userData } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (userData?.full_name) {
          setUserName(userData.full_name.split(' ')[0]);
        }

        const today = new Date().toISOString().split('T')[0];

        const { data: orders } = await supabase
          .from('work_orders')
          .select(`
            id,
            status,
            completion_percentage,
            started_at,
            completed_at,
            routes (
              name,
              estimated_duration_min
            )
          `)
          .eq('assigned_to', user.id)
          .eq('scheduled_date', today)
          .is('deleted_at', null)
          .in('status', ['in_progress', 'pending', 'completed'])
          .order('status', { ascending: true });

        if (orders && orders.length > 0) {
          const sorted = orders.sort((a, b) => {
            const priority: Record<string, number> = { in_progress: 0, pending: 1, completed: 2 };
            return (priority[a.status || ''] ?? 3) - (priority[b.status || ''] ?? 3);
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const wo = sorted[0] as any;

          const { data: allTasks } = await supabase
            .from('task_executions')
            .select('id, status')
            .eq('work_order_id', wo.id)
            .is('deleted_at', null);

          const taskCount = allTasks?.length || 0;
          const completedCount = allTasks?.filter((t) => t.status === 'completed').length || 0;

          setWorkOrder({
            ...wo,
            task_count: taskCount,
            completed_count: completedCount,
          });
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supabase]);

  const todayFormatted = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleAction = () => {
    if (workOrder) {
      router.push(`/lubricator/execute/${workOrder.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p style={{ color: '#A0AEC0', fontSize: '18px' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-bold text-white" style={{ fontSize: '24px' }}>
          Hola, {userName || 'Lubricador'}
        </h1>
        <p className="capitalize" style={{ color: '#A0AEC0', fontSize: '16px' }}>
          {todayFormatted}
        </p>
      </div>

      {!workOrder && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <CheckCircle className="w-20 h-20" style={{ color: '#38A169' }} />
          <p className="font-bold text-white text-center" style={{ fontSize: '20px' }}>
            No tienes tareas hoy
          </p>
          <p style={{ color: '#A0AEC0', fontSize: '16px' }}>
            Descansa o consulta con tu supervisor
          </p>
        </div>
      )}

      {workOrder?.status === 'pending' && (
        <div className="rounded-sm p-6 space-y-4" style={{ backgroundColor: '#2D3748' }}>
          <div>
            <p className="font-bold text-white" style={{ fontSize: '20px' }}>
              {workOrder.routes?.name || 'Ruta asignada'}
            </p>
            <p style={{ color: '#A0AEC0', fontSize: '16px' }}>
              {workOrder.task_count} puntos
            </p>
            {workOrder.routes?.estimated_duration_min && (
              <p style={{ color: '#A0AEC0', fontSize: '16px' }}>
                ~{workOrder.routes.estimated_duration_min} minutos
              </p>
            )}
          </div>

          <button
            onClick={handleAction}
            className="w-full font-bold text-white rounded-sm"
            style={{
              backgroundColor: '#38A169',
              height: '56px',
              fontSize: '20px',
            }}
          >
            INICIAR
          </button>
        </div>
      )}

      {workOrder?.status === 'in_progress' && (
        <div className="rounded-sm p-6 space-y-4" style={{ backgroundColor: '#2D3748' }}>
          <div>
            <p className="font-bold text-white" style={{ fontSize: '20px' }}>
              {workOrder.routes?.name || 'Ruta asignada'}
            </p>
            <p className="font-bold" style={{ color: '#A0AEC0', fontSize: '16px' }}>
              {workOrder.completed_count} de {workOrder.task_count} puntos
            </p>
          </div>

          <div>
            <div className="w-full h-4 rounded-sm overflow-hidden" style={{ backgroundColor: '#0F1419' }}>
              <div
                className="h-full rounded-sm transition-all"
                style={{
                  width: `${workOrder.task_count > 0 ? Math.round((workOrder.completed_count / workOrder.task_count) * 100) : 0}%`,
                  backgroundColor: '#38A169',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleAction}
            className="w-full font-bold text-white rounded-sm"
            style={{
              backgroundColor: '#D4740E',
              height: '56px',
              fontSize: '20px',
            }}
          >
            CONTINUAR
          </button>
        </div>
      )}

      {workOrder?.status === 'completed' && (
        <div className="rounded-sm p-6 space-y-4 text-center" style={{ backgroundColor: '#2D3748' }}>
          <CheckCircle className="w-16 h-16 mx-auto" style={{ color: '#38A169' }} />
          <p className="font-bold text-white" style={{ fontSize: '20px' }}>
            Ruta completada
          </p>
          <p style={{ color: '#A0AEC0', fontSize: '16px' }}>
            {workOrder.routes?.name}
          </p>
          {workOrder.completed_at && (
            <p style={{ color: '#A0AEC0', fontSize: '16px' }}>
              Finalizada a las {new Date(workOrder.completed_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
