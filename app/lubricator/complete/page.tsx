'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CompletionStats {
  totalPoints: number;
  durationMinutes: number;
  issuesReported: number;
  routeName: string;
}

function CompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workOrderId = searchParams.get('wo');
  const supabase = createClient();

  const [stats, setStats] = useState<CompletionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!workOrderId) {
        setLoading(false);
        return;
      }

      try {
        const { data: wo } = await supabase
          .from('work_orders')
          .select(`
            started_at,
            completed_at,
            routes (
              name
            )
          `)
          .eq('id', workOrderId)
          .single();

        const { data: tasks } = await supabase
          .from('task_executions')
          .select('id, status')
          .eq('work_order_id', workOrderId)
          .is('deleted_at', null);

        const totalPoints = tasks?.length || 0;
        const issuesReported = tasks?.filter((t) => t.status === 'issue_reported').length || 0;

        let durationMinutes = 0;
        if (wo?.started_at && wo?.completed_at) {
          const start = new Date(wo.started_at).getTime();
          const end = new Date(wo.completed_at).getTime();
          durationMinutes = Math.round((end - start) / 60000);
        }

        setStats({
          totalPoints,
          durationMinutes,
          issuesReported,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          routeName: (wo as any)?.routes?.name || 'Ruta',
        });
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [workOrderId, supabase]);

  const handleBack = () => {
    router.push('/lubricator/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p style={{ color: '#A0AEC0', fontSize: '18px' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-6 space-y-8">
      <CheckCircle className="w-24 h-24" style={{ color: '#38A169' }} />

      <p className="font-bold text-white text-center" style={{ fontSize: '28px' }}>
        Ruta Completada!
      </p>

      {stats && (
        <div className="w-full max-w-sm space-y-4">
          <p className="text-center" style={{ color: '#A0AEC0', fontSize: '16px' }}>
            {stats.routeName}
          </p>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-sm" style={{ backgroundColor: '#2D3748' }}>
              <p className="font-bold" style={{ color: '#38A169', fontSize: '28px' }}>
                {stats.totalPoints}
              </p>
              <p style={{ color: '#A0AEC0', fontSize: '14px' }}>puntos</p>
            </div>

            <div className="p-4 rounded-sm" style={{ backgroundColor: '#2D3748' }}>
              <p className="font-bold text-white" style={{ fontSize: '28px' }}>
                {stats.durationMinutes}
              </p>
              <p style={{ color: '#A0AEC0', fontSize: '14px' }}>minutos</p>
            </div>

            <div className="p-4 rounded-sm" style={{ backgroundColor: '#2D3748' }}>
              <p className="font-bold" style={{
                color: stats.issuesReported > 0 ? '#E53E3E' : '#38A169',
                fontSize: '28px',
              }}>
                {stats.issuesReported}
              </p>
              <p style={{ color: '#A0AEC0', fontSize: '14px' }}>problemas</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleBack}
        className="w-full max-w-sm font-bold text-white rounded-sm"
        style={{
          backgroundColor: '#1B2A4A',
          height: '56px',
          fontSize: '20px',
        }}
      >
        VOLVER AL INICIO
      </button>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full p-6">
        <p style={{ color: '#A0AEC0', fontSize: '18px' }}>Cargando...</p>
      </div>
    }>
      <CompleteContent />
    </Suspense>
  );
}
