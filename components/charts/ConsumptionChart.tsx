'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { createClient } from '@/lib/supabase/client';

interface ConsumptionData {
  lubricant: string;
  real: number;
  planned: number;
  diff_pct: number;
}

export function ConsumptionChart() {
  const [data, setData] = useState<ConsumptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 30);

        const { data: tasks, error } = await supabase
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
          .gte('executed_at', fromDate.toISOString())
          .eq('status', 'completed');

        if (error) throw error;

        const grouped: Record<string, { real: number; planned: number }> = {};

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const task of (tasks || []) as any[]) {
          const lubName = task.lubrication_points?.lubricant_types?.name;
          if (!lubName) continue;

          if (!grouped[lubName]) {
            grouped[lubName] = { real: 0, planned: 0 };
          }
          grouped[lubName].real += task.lubricant_used_ml || 0;
          grouped[lubName].planned += task.lubrication_points?.quantity_ml || 0;
        }

        const chartData = Object.entries(grouped).map(([lubricant, stats]) => ({
          lubricant,
          real: Math.round(stats.real),
          planned: Math.round(stats.planned),
          diff_pct: stats.planned > 0
            ? Math.round(((stats.real - stats.planned) / stats.planned) * 100)
            : 0,
        }));

        setData(chartData);
      } catch (err) {
        console.error('Error cargando consumo:', err);
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
      <h3 className="text-white font-bold text-lg">Consumo Real vs Planificado</h3>
      <p className="text-fog text-sm">Últimos 30 días (ml)</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-fog">Sin datos de consumo disponibles</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(160, 174, 192, 0.15)" />
              <XAxis
                dataKey="lubricant"
                tick={{ fill: '#A0AEC0', fontSize: 11 }}
                axisLine={{ stroke: '#A0AEC0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#A0AEC0', fontSize: 12 }}
                axisLine={{ stroke: '#A0AEC0' }}
                tickLine={false}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1B2A4A',
                  border: '1px solid #2D3748',
                  borderRadius: '2px',
                  color: '#fff',
                }}
                formatter={(value: number | undefined, name: string | undefined) => [
                  `${(value ?? 0).toLocaleString()} ml`,
                  name === 'real' ? 'Consumo Real' : 'Planificado',
                ]}
              />
              <Legend
                wrapperStyle={{ color: '#A0AEC0', fontSize: '12px' }}
                formatter={(value) => (value === 'real' ? 'Consumo Real' : 'Planificado')}
              />
              <Bar dataKey="planned" fill="#4A5568" radius={[2, 2, 0, 0]} />
              <Bar dataKey="real" fill="#D4740E" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {data.map((item) => (
              <div
                key={item.lubricant}
                className="p-2 rounded-sm text-center"
                style={{
                  backgroundColor: 'rgba(15, 20, 25, 0.3)',
                  border: '1px solid rgba(45, 55, 72, 0.5)',
                }}
              >
                <p className="text-fog text-xs truncate">{item.lubricant}</p>
                <p
                  className="font-mono font-bold text-sm"
                  style={{
                    color: item.diff_pct > 10 ? '#E53E3E' : item.diff_pct < -10 ? '#ECC94B' : '#38A169',
                  }}
                >
                  {item.diff_pct > 0 ? '+' : ''}{item.diff_pct}%
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
