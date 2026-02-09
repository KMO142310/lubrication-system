'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, SkipForward } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInsights } from '@/hooks/useInsights';
import { IncidentHeatmap } from '@/components/charts/IncidentHeatmap';
import { ConsumptionChart } from '@/components/charts/ConsumptionChart';

interface LubPerf {
  user_id: string;
  full_name: string;
  completed_orders: number;
  total_orders: number;
  compliance_rate: number;
  avg_time_minutes: number;
}

interface SkippedPt {
  point_id: string;
  point_name: string;
  machine_name: string;
  skip_count: number;
  total_count: number;
  skip_rate: number;
}

function getSkipSuggestion(skipRate: number): string {
  if (skipRate >= 80) return 'Punto posiblemente inaccesible o fuera de servicio';
  if (skipRate >= 50) return 'Revisar accesibilidad o reasignar en ruta';
  if (skipRate >= 30) return 'Posible falta de lubricante o herramienta';
  return 'Revisar con lubricador asignado';
}

export default function InsightsPage() {
  const { lubricatorPerformance, skippedPoints } = useInsights();
  const [performance, setPerformance] = useState<LubPerf[]>([]);
  const [skipped, setSkipped] = useState<SkippedPt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [perfData, skipData] = await Promise.all([
          lubricatorPerformance(),
          skippedPoints(),
        ]);
        setPerformance(perfData);
        setSkipped(skipData);
      } catch (err) {
        console.error('Error cargando insights:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Análisis e Insights</h1>
        <p className="text-fog mt-1">Métricas de los últimos 30 días</p>
      </div>

      {/* Rendimiento por Lubricador */}
      <div className="rounded-sm p-6 space-y-4" style={{ backgroundColor: '#2D3748' }}>
        <h3 className="text-white font-bold text-lg">Rendimiento por Lubricador</h3>

        {loading ? (
          <p className="text-fog">Cargando datos...</p>
        ) : performance.length === 0 ? (
          <p className="text-fog text-center py-8">Sin datos de rendimiento disponibles</p>
        ) : (
          <div className="rounded-sm border border-slate-panel overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lubricador</TableHead>
                  <TableHead className="text-center">OT Completadas</TableHead>
                  <TableHead className="text-center">Total OT</TableHead>
                  <TableHead className="text-center">Tasa Cumplimiento</TableHead>
                  <TableHead className="text-center">Tiempo Promedio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performance.map((perf, idx) => (
                  <TableRow
                    key={perf.user_id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? 'rgba(15, 20, 25, 0.3)' : 'transparent',
                    }}
                  >
                    <TableCell className="font-medium text-white">
                      {perf.full_name}
                    </TableCell>
                    <TableCell className="text-center text-white font-mono">
                      {perf.completed_orders}
                    </TableCell>
                    <TableCell className="text-center text-fog font-mono">
                      {perf.total_orders}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={perf.compliance_rate >= 90 ? 'success' : perf.compliance_rate >= 70 ? 'secondary' : 'destructive'}
                      >
                        {perf.compliance_rate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-fog font-mono">
                      {perf.avg_time_minutes > 0 ? `${perf.avg_time_minutes} min` : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Heatmap de Incidentes */}
      <IncidentHeatmap />

      {/* Consumo Real vs Planificado */}
      <ConsumptionChart />

      {/* Puntos Problemáticos */}
      <div className="rounded-sm p-6 space-y-4" style={{ backgroundColor: '#2D3748' }}>
        <div className="flex items-center gap-2">
          <SkipForward className="w-5 h-5 text-machinery" />
          <h3 className="text-white font-bold text-lg">Puntos Problemáticos</h3>
        </div>
        <p className="text-fog text-sm">Puntos de lubricación más saltados en los últimos 30 días</p>

        {loading ? (
          <p className="text-fog">Cargando datos...</p>
        ) : skipped.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-fog">Sin puntos saltados — buen trabajo del equipo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {skipped.slice(0, 10).map((pt) => (
              <div
                key={pt.point_id}
                className="flex items-start justify-between p-4 rounded-sm"
                style={{
                  backgroundColor: 'rgba(15, 20, 25, 0.3)',
                  borderLeft: `3px solid ${pt.skip_rate >= 50 ? '#E53E3E' : '#ECC94B'}`,
                }}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{pt.point_name}</p>
                    <Badge variant={pt.skip_rate >= 50 ? 'destructive' : 'secondary'}>
                      {pt.skip_rate}% saltado
                    </Badge>
                  </div>
                  <p className="text-fog text-sm">Máquina: {pt.machine_name}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#ECC94B' }} />
                    <p className="text-sm" style={{ color: '#ECC94B' }}>
                      {getSkipSuggestion(pt.skip_rate)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-mono font-bold">
                    {pt.skip_count}/{pt.total_count}
                  </p>
                  <p className="text-fog text-xs">saltados</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
