'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ExecutionPoint {
  id: string;
  lubrication_point_id: string;
  status: string | null;
  point_name: string;
  point_code: string;
  machine_name: string | null;
  lubricant_name: string | null;
  quantity_ml: number | null;
  image_url: string | null;
  safety_notes: string | null;
  method: string | null;
}

export default function ExecuteRoutePage() {
  const params = useParams();
  const workOrderId = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [points, setPoints] = useState<ExecutionPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const loadPoints = async () => {
      try {
        // Actualizar OT a in_progress si está pending
        const { data: wo } = await supabase
          .from('work_orders')
          .select('status')
          .eq('id', workOrderId)
          .single();

        if (wo?.status === 'pending') {
          await supabase
            .from('work_orders')
            .update({ status: 'in_progress', started_at: new Date().toISOString() })
            .eq('id', workOrderId);
        }

        // Traer task_executions con datos del punto
        const { data: tasks, error } = await supabase
          .from('task_executions')
          .select(`
            id,
            lubrication_point_id,
            status,
            lubrication_points (
              name,
              code,
              image_url,
              safety_notes,
              quantity_ml,
              method,
              machines (
                name
              ),
              lubricant_types (
                name
              )
            )
          `)
          .eq('work_order_id', workOrderId)
          .is('deleted_at', null)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: ExecutionPoint[] = (tasks || []).map((t: any) => ({
          id: t.id,
          lubrication_point_id: t.lubrication_point_id,
          status: t.status,
          point_name: t.lubrication_points?.name || '—',
          point_code: t.lubrication_points?.code || '—',
          machine_name: t.lubrication_points?.machines?.name || null,
          lubricant_name: t.lubrication_points?.lubricant_types?.name || null,
          quantity_ml: t.lubrication_points?.quantity_ml || null,
          image_url: t.lubrication_points?.image_url || null,
          safety_notes: t.lubrication_points?.safety_notes || null,
          method: t.lubrication_points?.method || null,
        }));

        setPoints(mapped);

        // Retomar desde el primer punto no completado
        const firstPending = mapped.findIndex((p) => p.status !== 'completed');
        setCurrentIndex(firstPending >= 0 ? firstPending : mapped.length - 1);
      } catch (err) {
        console.error('Error cargando puntos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPoints();
  }, [workOrderId, supabase]);

  const handleComplete = async () => {
    if (completing) return;
    setCompleting(true);

    try {
      const currentPoint = points[currentIndex];

      const { data: { user } } = await supabase.auth.getUser();

      await supabase
        .from('task_executions')
        .update({
          status: 'completed',
          executed_at: new Date().toISOString(),
          executed_by: user?.id || null,
        })
        .eq('id', currentPoint.id);

      // Animación de check
      setShowCheck(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setShowCheck(false);

      const updatedPoints = [...points];
      updatedPoints[currentIndex] = { ...currentPoint, status: 'completed' };
      setPoints(updatedPoints);

      const isLast = currentIndex === points.length - 1;

      if (isLast) {
        // Completar OT
        const totalTasks = points.length;
        const completedTasks = updatedPoints.filter((p) => p.status === 'completed').length;
        const percentage = Math.round((completedTasks / totalTasks) * 100);

        await supabase
          .from('work_orders')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            completion_percentage: percentage,
          })
          .eq('id', workOrderId);

        router.push('/lubricator/complete?wo=' + workOrderId);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (err) {
      console.error('Error completando punto:', err);
    } finally {
      setCompleting(false);
    }
  };

  const handleProblem = () => {
    const currentPoint = points[currentIndex];
    router.push(
      `/lubricator/report?task_id=${currentPoint.id}&point_id=${currentPoint.lubrication_point_id}`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p style={{ color: '#A0AEC0', fontSize: '18px' }}>Cargando ruta...</p>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p style={{ color: '#A0AEC0', fontSize: '18px' }}>No hay puntos en esta ruta</p>
      </div>
    );
  }

  const current = points[currentIndex];
  const completedCount = points.filter((p) => p.status === 'completed').length;
  const progressPercent = Math.round((completedCount / points.length) * 100);

  const methodLabels: Record<string, string> = {
    manual_grease: 'Grasa manual',
    oil_can: 'Aceitera',
    automatic: 'Automático',
    spray: 'Spray',
    immersion: 'Inmersión',
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Check animation overlay */}
      {showCheck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <CheckCircle className="w-32 h-32" style={{ color: '#38A169' }} />
        </div>
      )}

      {/* Barra de progreso */}
      <div className="p-4 space-y-2">
        <p className="text-center font-bold text-white" style={{ fontSize: '18px' }}>
          {currentIndex + 1} de {points.length}
        </p>
        <div className="w-full h-3 rounded-sm overflow-hidden" style={{ backgroundColor: '#2D3748' }}>
          <div
            className="h-full rounded-sm transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: '#38A169',
            }}
          />
        </div>
      </div>

      {/* Contenido del punto */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {current.machine_name && (
          <p style={{ color: '#A0AEC0', fontSize: '16px' }}>
            {current.machine_name}
          </p>
        )}

        <p className="font-bold text-white" style={{ fontSize: '24px' }}>
          {current.point_name}
        </p>

        {current.image_url && (
          <div className="rounded-sm overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image_url}
              alt={current.point_name}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {current.lubricant_name && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#D4740E' }} />
            <p style={{ color: '#A0AEC0', fontSize: '16px' }}>
              {current.lubricant_name}
              {current.method && ` — ${methodLabels[current.method] || current.method}`}
            </p>
          </div>
        )}

        {current.quantity_ml && (
          <p className="font-bold" style={{ color: '#D4740E', fontSize: '28px' }}>
            {current.quantity_ml} ml
          </p>
        )}

        {current.safety_notes && (
          <div
            className="flex items-start gap-3 p-4 rounded-sm"
            style={{ backgroundColor: 'rgba(236, 201, 75, 0.1)', borderLeft: '4px solid #ECC94B' }}
          >
            <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: '#ECC94B' }} />
            <p style={{ color: '#ECC94B', fontSize: '16px' }}>
              {current.safety_notes}
            </p>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="p-4 space-y-3">
        <button
          onClick={handleComplete}
          disabled={completing}
          className="w-full font-bold text-white rounded-sm disabled:opacity-50"
          style={{
            backgroundColor: '#38A169',
            height: '56px',
            fontSize: '20px',
          }}
        >
          LISTO
        </button>

        <button
          onClick={handleProblem}
          className="w-full font-bold text-white rounded-sm"
          style={{
            backgroundColor: '#D4740E',
            height: '56px',
            fontSize: '20px',
          }}
        >
          PROBLEMA
        </button>
      </div>
    </div>
  );
}
