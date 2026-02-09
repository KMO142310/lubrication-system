'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface HeatmapData {
  machine_id: string;
  machine_name: string;
  by_type: Record<string, number>;
  total: number;
}

const incidentTypes = ['leak', 'damage', 'noise', 'hot', 'no_lubricant', 'other'];
const typeLabels: Record<string, string> = {
  leak: 'Fuga',
  damage: 'Daño',
  noise: 'Ruido',
  hot: 'Caliente',
  no_lubricant: 'Sin Lub.',
  other: 'Otro',
};

function getCellColor(count: number): string {
  if (count === 0) return 'transparent';
  if (count <= 2) return 'rgba(236, 201, 75, 0.4)';
  return 'rgba(229, 62, 62, 0.5)';
}

function getCellTextColor(count: number): string {
  if (count === 0) return '#4A5568';
  if (count <= 2) return '#ECC94B';
  return '#E53E3E';
}

export function IncidentHeatmap() {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 30);

        const { data: incidents, error } = await supabase
          .from('incidents')
          .select(`
            type,
            lubrication_points (
              machines (
                id,
                name
              )
            )
          `)
          .gte('created_at', fromDate.toISOString())
          .is('deleted_at', null);

        if (error) throw error;

        const grouped: Record<string, { machine_name: string; by_type: Record<string, number>; total: number }> = {};

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const inc of (incidents || []) as any[]) {
          const machine = inc.lubrication_points?.machines;
          if (!machine?.id) continue;

          const mid = machine.id;
          if (!grouped[mid]) {
            grouped[mid] = { machine_name: machine.name, by_type: {}, total: 0 };
          }
          const t = inc.type || 'other';
          grouped[mid].by_type[t] = (grouped[mid].by_type[t] || 0) + 1;
          grouped[mid].total++;
        }

        const result = Object.entries(grouped)
          .map(([machine_id, stats]) => ({ machine_id, ...stats }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 15);

        setData(result);
      } catch (err) {
        console.error('Error cargando heatmap:', err);
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
        <p className="text-fog">Cargando heatmap...</p>
      </div>
    );
  }

  return (
    <div className="rounded-sm p-6 space-y-4" style={{ backgroundColor: '#2D3748' }}>
      <h3 className="text-white font-bold text-lg">Máquinas con más Incidentes</h3>
      <p className="text-fog text-sm">Últimos 30 días</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-fog">Sin incidentes registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-fog font-medium p-2 border-b border-slate-panel min-w-[140px]">
                  Máquina
                </th>
                {incidentTypes.map((type) => (
                  <th
                    key={type}
                    className="text-center text-fog font-medium p-2 border-b border-slate-panel min-w-[60px]"
                  >
                    {typeLabels[type]}
                  </th>
                ))}
                <th className="text-center text-fog font-medium p-2 border-b border-slate-panel min-w-[50px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={row.machine_id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? 'rgba(15, 20, 25, 0.2)' : 'transparent',
                  }}
                >
                  <td className="text-white font-medium p-2 truncate max-w-[180px]">
                    {row.machine_name}
                  </td>
                  {incidentTypes.map((type) => {
                    const count = row.by_type[type] || 0;
                    return (
                      <td
                        key={type}
                        className="text-center p-2 font-mono font-bold"
                        style={{
                          backgroundColor: getCellColor(count),
                          color: getCellTextColor(count),
                          fontSize: '13px',
                        }}
                      >
                        {count > 0 ? count : '·'}
                      </td>
                    );
                  })}
                  <td
                    className="text-center p-2 font-mono font-bold"
                    style={{ color: '#fff', fontSize: '13px' }}
                  >
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-fog pt-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'transparent', border: '1px solid #4A5568' }} />
          <span>0</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'rgba(236, 201, 75, 0.4)' }} />
          <span>1-2</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'rgba(229, 62, 62, 0.5)' }} />
          <span>3+</span>
        </div>
      </div>
    </div>
  );
}
