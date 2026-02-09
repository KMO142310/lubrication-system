'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createClient } from '@/lib/supabase/client';

interface AreaCompliance {
  area: string;
  percentage: number;
}

export function ComplianceByAreaChart() {
  const [data, setData] = useState<AreaCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fromDate = sevenDaysAgo.toISOString().split('T')[0];

        const { data: orders } = await supabase
          .from('work_orders')
          .select(`
            id,
            status,
            routes (
              route_points (
                lubrication_points (
                  machines (
                    areas (
                      name
                    )
                  )
                )
              )
            )
          `)
          .gte('scheduled_date', fromDate)
          .is('deleted_at', null)
          .not('status', 'eq', 'cancelled');

        if (!orders || orders.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const areaStats: Record<string, { total: number; completed: number }> = {};

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const wo of orders as any[]) {
          const areas = new Set<string>();
          const routePoints = wo.routes?.route_points || [];

          for (const rp of routePoints) {
            const areaName = rp.lubrication_points?.machines?.areas?.name;
            if (areaName) areas.add(areaName);
          }

          for (const areaName of areas) {
            if (!areaStats[areaName]) {
              areaStats[areaName] = { total: 0, completed: 0 };
            }
            areaStats[areaName].total++;
            if (wo.status === 'completed') {
              areaStats[areaName].completed++;
            }
          }
        }

        const chartData: AreaCompliance[] = Object.entries(areaStats).map(([area, stats]) => ({
          area,
          percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
        }));

        setData(chartData);
      } catch (err) {
        console.error('Error cargando cumplimiento por área:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="rounded-sm p-6" style={{ backgroundColor: '#2D3748' }}>
        <p className="text-fog">Cargando gráfico...</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm p-6 space-y-4" style={{ backgroundColor: '#2D3748' }}>
      <h3 className="text-white font-bold text-lg">Cumplimiento por Área</h3>
      <p className="text-fog text-sm">Últimos 7 días</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-fog">Sin datos disponibles</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(160, 174, 192, 0.15)" />
            <XAxis
              dataKey="area"
              tick={{ fill: '#A0AEC0', fontSize: 12 }}
              axisLine={{ stroke: '#A0AEC0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#A0AEC0', fontSize: 12 }}
              axisLine={{ stroke: '#A0AEC0' }}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1B2A4A',
                border: '1px solid #2D3748',
                borderRadius: '2px',
                color: '#fff',
              }}
              formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Cumplimiento']}
            />
            <Bar dataKey="percentage" fill="#D4740E" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
