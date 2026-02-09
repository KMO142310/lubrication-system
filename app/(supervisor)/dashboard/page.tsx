'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { KpiCard } from '@/components/charts/KpiCard';
import { ComplianceByAreaChart } from '@/components/charts/ComplianceByAreaChart';
import { ComplianceTrendChart } from '@/components/charts/ComplianceTrendChart';
import { RecentActivityTable } from '@/components/charts/RecentActivityTable';

interface DashboardKpis {
  completedToday: number;
  complianceRate: string;
  openIncidents: number;
  criticalStock: number;
}

export default function SupervisorDashboard() {
  const [kpis, setKpis] = useState<DashboardKpis>({
    completedToday: 0,
    complianceRate: '—',
    openIncidents: 0,
    criticalStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadKpis = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];

        // OT Completadas hoy
        const { count: completedCount } = await supabase
          .from('work_orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed')
          .eq('scheduled_date', today)
          .is('deleted_at', null);

        // Total OT de hoy para tasa de cumplimiento
        const { count: totalToday } = await supabase
          .from('work_orders')
          .select('id', { count: 'exact', head: true })
          .eq('scheduled_date', today)
          .is('deleted_at', null)
          .not('status', 'eq', 'cancelled');

        const rate = totalToday && totalToday > 0
          ? `${Math.round(((completedCount || 0) / totalToday) * 100)}%`
          : '—';

        // Incidentes abiertos
        const { count: openIncidents } = await supabase
          .from('incidents')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'open');

        // Stock crítico
        let criticalStock = 0;
        try {
          const { count: criticalCount } = await supabase
            .from('inventory')
            .select('id', { count: 'exact', head: true })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter('current_stock_ml', 'lt', 'minimum_stock_ml' as any);
          criticalStock = criticalCount || 0;
        } catch {
          criticalStock = 0;
        }

        setKpis({
          completedToday: completedCount || 0,
          complianceRate: rate,
          openIncidents: openIncidents || 0,
          criticalStock,
        });
      } catch (err) {
        console.error('Error cargando KPIs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadKpis();
  }, [supabase]);

  const todayFormatted = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-fog mt-1 capitalize">{todayFormatted}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-fog">Cargando indicadores...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="OT Completadas Hoy"
            value={kpis.completedToday}
            icon={CheckCircle}
            color="#38A169"
          />
          <KpiCard
            title="Tasa de Cumplimiento"
            value={kpis.complianceRate}
            subtitle="OT completadas / programadas hoy"
            icon={TrendingUp}
            color="#D4740E"
          />
          <KpiCard
            title="Incidentes Abiertos"
            value={kpis.openIncidents}
            icon={AlertTriangle}
            color={kpis.openIncidents > 0 ? '#E53E3E' : '#ECC94B'}
          />
          <KpiCard
            title="Stock Crítico"
            value={kpis.criticalStock}
            subtitle="Lubricantes bajo mínimo"
            icon={Package}
            color={kpis.criticalStock > 0 ? '#E53E3E' : '#38A169'}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ComplianceByAreaChart />
        <ComplianceTrendChart />
      </div>

      <RecentActivityTable />
    </div>
  );
}
