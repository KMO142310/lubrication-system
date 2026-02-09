'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createClient } from '@/lib/supabase/client';

interface DayCompliance {
  date: string;
  label: string;
  percentage: number;
}

export function ComplianceTrendChart() {
  const [data, setData] = useState<DayCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

        const { data: orders } = await supabase
          .from('work_orders')
          .select('id, status, scheduled_date')
          .gte('scheduled_date', fromDate)
          .is('deleted_at', null)
          .not('status', 'eq', 'cancelled');

        if (!orders || orders.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        const dayStats: Record<string, { total: number; completed: number }> = {};

        for (const wo of orders) {
          const date = wo.scheduled_date;
          if (!date) continue;

          if (!dayStats[date]) {
            dayStats[date] = { total: 0, completed: 0 };
          }
          dayStats[date].total++;
          if (wo.status === 'completed') {
            dayStats[date].completed++;
          }
        }

        const chartData: DayCompliance[] = Object.entries(dayStats)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, stats]) => ({
            date,
            label: new Date(date + 'T12:00:00').toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' }),
            percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
          }));

        setData(chartData);
      } catch (err) {
        console.error('Error cargando tendencia:', err);
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
      <h3 className="text-white font-bold text-lg">Tendencia de Cumplimiento</h3>
      <p className="text-fog text-sm">Últimos 30 días</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-fog">Sin datos disponibles</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(160, 174, 192, 0.15)" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#A0AEC0', fontSize: 11 }}
              axisLine={{ stroke: '#A0AEC0' }}
              tickLine={false}
              interval="preserveStartEnd"
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
              labelFormatter={(label) => `Fecha: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#38A169"
              strokeWidth={2}
              dot={{ fill: '#D4740E', r: 3, strokeWidth: 0 }}
              activeDot={{ fill: '#D4740E', r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
