'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ActivityItem {
  id: string;
  type: 'ot_completed' | 'incident';
  time: string;
  detail: string;
  responsible: string;
  timestamp: number;
}

export function RecentActivityTable() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const items: ActivityItem[] = [];

        // OT completadas recientes
        const { data: completedOrders } = await supabase
          .from('work_orders')
          .select(`
            id,
            completed_at,
            routes (
              name
            ),
            assigned_to_user:users!work_orders_assigned_to_fkey (
              full_name
            )
          `)
          .eq('status', 'completed')
          .not('completed_at', 'is', null)
          .is('deleted_at', null)
          .order('completed_at', { ascending: false })
          .limit(10);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const wo of (completedOrders || []) as any[]) {
          items.push({
            id: `wo-${wo.id}`,
            type: 'ot_completed',
            time: wo.completed_at
              ? new Date(wo.completed_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
              : '—',
            detail: wo.routes?.name || 'Ruta completada',
            responsible: wo.assigned_to_user?.full_name || '—',
            timestamp: wo.completed_at ? new Date(wo.completed_at).getTime() : 0,
          });
        }

        // Incidentes recientes
        const { data: incidents } = await supabase
          .from('incidents')
          .select(`
            id,
            created_at,
            type,
            severity,
            description,
            reported_by_user:users!incidents_reported_by_fkey (
              full_name
            )
          `)
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(10);

        const incidentTypeLabels: Record<string, string> = {
          leak: 'Fuga',
          damage: 'Daño',
          noise: 'Ruido',
          hot: 'Sobrecalentamiento',
          no_lubricant: 'Sin lubricante',
          other: 'Otro problema',
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const inc of (incidents || []) as any[]) {
          items.push({
            id: `inc-${inc.id}`,
            type: 'incident',
            time: inc.created_at
              ? new Date(inc.created_at).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
              : '—',
            detail: inc.description || incidentTypeLabels[inc.type] || 'Incidente reportado',
            responsible: inc.reported_by_user?.full_name || '—',
            timestamp: inc.created_at ? new Date(inc.created_at).getTime() : 0,
          });
        }

        // Ordenar por fecha descendente y tomar 10
        items.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(items.slice(0, 10));
      } catch (err) {
        console.error('Error cargando actividad reciente:', err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="rounded-sm p-6" style={{ backgroundColor: '#2D3748' }}>
        <p className="text-fog">Cargando actividad...</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm p-6 space-y-4" style={{ backgroundColor: '#2D3748' }}>
      <h3 className="text-white font-bold text-lg">Actividad Reciente</h3>

      {activities.length === 0 ? (
        <div className="flex items-center justify-center h-24">
          <p className="text-fog">Sin actividad reciente</p>
        </div>
      ) : (
        <div className="rounded-sm border border-slate-panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity, index) => (
                <TableRow
                  key={activity.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'rgba(15, 20, 25, 0.3)' : 'transparent',
                  }}
                >
                  <TableCell className="text-white font-mono text-sm">
                    {activity.time}
                  </TableCell>
                  <TableCell>
                    {activity.type === 'ot_completed' ? (
                      <Badge variant="success">OT Completada</Badge>
                    ) : (
                      <Badge variant="destructive">Incidente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-fog max-w-xs truncate">
                    {activity.detail}
                  </TableCell>
                  <TableCell className="text-fog">
                    {activity.responsible}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
