'use client';

import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';

interface ReportWorkOrder {
  id: string;
  route_name: string;
  assigned_to_name: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  completion_percentage: number | null;
}

interface ReportIncident {
  id: string;
  type: string;
  severity: string;
  description: string | null;
  point_name: string;
  machine_name: string;
  reported_by_name: string;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [reportData, setReportData] = useState<{
    companyName: string;
    workOrders: ReportWorkOrder[];
    incidents: ReportIncident[];
  } | null>(null);

  const supabase = createClient();

  const handleGenerate = async () => {
    setGenerating(true);
    setReportData(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const { data: userData } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();

      let companyName = 'BITACORA';
      if (userData?.company_id) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('name')
          .eq('id', userData.company_id)
          .single();
        if (companyData?.name) companyName = companyData.name;
      }

      const { data: orders } = await supabase
        .from('work_orders')
        .select(`
          id,
          status,
          started_at,
          completed_at,
          completion_percentage,
          routes (
            name
          ),
          assigned_to_user:users!work_orders_assigned_to_fkey (
            full_name
          )
        `)
        .eq('scheduled_date', selectedDate)
        .is('deleted_at', null)
        .not('status', 'eq', 'cancelled');

      const workOrders: ReportWorkOrder[] = (orders || []).map((wo: Record<string, unknown>) => ({
        id: wo.id as string,
        route_name: (wo.routes as Record<string, unknown> | null)?.name as string || '—',
        assigned_to_name: (wo.assigned_to_user as Record<string, unknown> | null)?.full_name as string || '—',
        status: (wo.status as string) || 'pending',
        started_at: wo.started_at as string | null,
        completed_at: wo.completed_at as string | null,
        completion_percentage: wo.completion_percentage as number | null,
      }));

      const { data: incidentsData } = await supabase
        .from('incidents')
        .select(`
          id,
          type,
          severity,
          description,
          created_at,
          lubrication_points (
            name,
            machines (
              name
            )
          ),
          reported_by_user:users!incidents_reported_by_fkey (
            full_name
          )
        `)
        .gte('created_at', `${selectedDate}T00:00:00`)
        .lte('created_at', `${selectedDate}T23:59:59`)
        .is('deleted_at', null);

      const incidents: ReportIncident[] = (incidentsData || []).map((inc: Record<string, unknown>) => ({
        id: inc.id as string,
        type: (inc.type as string) || 'other',
        severity: (inc.severity as string) || 'low',
        description: inc.description as string | null,
        point_name: (inc.lubrication_points as Record<string, unknown> | null)?.name as string || '—',
        machine_name: ((inc.lubrication_points as Record<string, unknown> | null)?.machines as Record<string, unknown> | null)?.name as string || '—',
        reported_by_name: (inc.reported_by_user as Record<string, unknown> | null)?.full_name as string || '—',
      }));

      setReportData({ companyName, workOrders, incidents });
      toast.success('Reporte generado. Haz click en "Descargar PDF".');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al generar reporte');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!reportData) return;
    setDownloading(true);

    try {
      const renderer = await import('@react-pdf/renderer');
      const { DailyReport } = await import('@/components/reports/DailyReport');
      const { createElement } = await import('react');

      const doc = createElement(DailyReport, {
        date: selectedDate,
        companyName: reportData.companyName,
        workOrders: reportData.workOrders,
        incidents: reportData.incidents,
      });

      type PdfFn = (el: React.ReactElement) => { toBlob: () => Promise<Blob> };
      const pdfFn = renderer.pdf as unknown as PdfFn;
      const blob = await pdfFn(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bitacora-informe-diario-${selectedDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Error al generar PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reportes</h1>
        <p className="text-fog mt-1">Genera informes de gestión en PDF</p>
      </div>

      <div className="rounded-sm p-6 space-y-6" style={{ backgroundColor: '#2D3748' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label>Tipo de Reporte</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Informe Diario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setReportData(null);
              }}
            />
          </div>

          <Button onClick={handleGenerate} disabled={generating} className="gap-2">
            {generating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FileDown className="w-5 h-5" />
            )}
            {generating ? 'Generando...' : 'Generar Reporte'}
          </Button>
        </div>

        {reportData && (
          <div className="flex items-center justify-between p-4 rounded-sm border border-machinery/30 bg-carbon/50">
            <div>
              <p className="text-white font-medium">Informe Diario — {selectedDate}</p>
              <p className="text-fog text-sm">
                {reportData.workOrders.length} OT · {reportData.incidents.length} incidentes
              </p>
            </div>
            <Button variant="default" disabled={downloading} className="gap-2" onClick={handleDownload}>
              {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
              {downloading ? 'Preparando...' : 'Descargar PDF'}
            </Button>
          </div>
        )}
      </div>

      {reportData && (
        <div className="rounded-sm p-6 space-y-4" style={{ backgroundColor: '#2D3748' }}>
          <h3 className="text-white font-bold text-lg">Vista Previa</h3>

          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-sm bg-carbon/50 text-center">
              <p className="text-2xl font-bold text-white">{reportData.workOrders.length}</p>
              <p className="text-fog text-sm">Total OT</p>
            </div>
            <div className="p-4 rounded-sm bg-carbon/50 text-center">
              <p className="text-2xl font-bold" style={{ color: '#38A169' }}>
                {reportData.workOrders.filter((wo) => wo.status === 'completed').length}
              </p>
              <p className="text-fog text-sm">Completadas</p>
            </div>
            <div className="p-4 rounded-sm bg-carbon/50 text-center">
              <p className="text-2xl font-bold" style={{ color: '#D4740E' }}>
                {reportData.workOrders.filter((wo) => wo.status !== 'completed').length}
              </p>
              <p className="text-fog text-sm">Pendientes</p>
            </div>
            <div className="p-4 rounded-sm bg-carbon/50 text-center">
              <p className="text-2xl font-bold" style={{ color: '#E53E3E' }}>
                {reportData.incidents.length}
              </p>
              <p className="text-fog text-sm">Incidentes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
