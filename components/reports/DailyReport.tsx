import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { ReportTemplate } from './ReportTemplate';

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B2A4A',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#D4740E',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B2A4A',
  },
  summaryLabel: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1B2A4A',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  tableCell: {
    fontSize: 8,
    color: '#333',
  },
  incidentCard: {
    padding: 8,
    marginBottom: 6,
    backgroundColor: '#fff5f5',
    borderLeftWidth: 3,
    borderLeftColor: '#E53E3E',
    borderRadius: 2,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  incidentType: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#E53E3E',
  },
  incidentSeverity: {
    fontSize: 8,
    color: '#666',
  },
  incidentDetail: {
    fontSize: 8,
    color: '#444',
    marginTop: 2,
  },
  noData: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});

interface DailyReportWorkOrder {
  id: string;
  route_name: string;
  assigned_to_name: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  completion_percentage: number | null;
}

interface DailyReportIncident {
  id: string;
  type: string;
  severity: string;
  description: string | null;
  point_name: string;
  machine_name: string;
  reported_by_name: string;
}

interface DailyReportProps {
  date: string;
  companyName: string;
  companyLogo?: string;
  workOrders: DailyReportWorkOrder[];
  incidents: DailyReportIncident[];
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completada',
  incomplete: 'Incompleta',
  cancelled: 'Cancelada',
};

const typeLabels: Record<string, string> = {
  leak: 'Fuga',
  damage: 'Daño',
  noise: 'Ruido',
  hot: 'Sobrecalentamiento',
  no_lubricant: 'Sin lubricante',
  other: 'Otro',
};

const severityLabels: Record<string, string> = {
  low: 'Puede esperar',
  medium: 'Atender pronto',
  high: 'Urgente',
};

const formatTime = (isoString: string | null): string => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function DailyReport({
  date,
  companyName,
  companyLogo,
  workOrders,
  incidents,
}: DailyReportProps) {
  const total = workOrders.length;
  const completed = workOrders.filter((wo) => wo.status === 'completed').length;
  const incomplete = workOrders.filter(
    (wo) => wo.status === 'incomplete' || wo.status === 'in_progress'
  ).length;
  const complianceRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <ReportTemplate
      companyName={companyName}
      companyLogo={companyLogo}
      reportTitle="Informe Diario de Lubricación"
      reportDate={formattedDate}
    >
      {/* Resumen */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen del Día</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{total}</Text>
            <Text style={styles.summaryLabel}>Total OT</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: '#38A169' }]}>{completed}</Text>
            <Text style={styles.summaryLabel}>Completadas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: '#D4740E' }]}>{incomplete}</Text>
            <Text style={styles.summaryLabel}>Incompletas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: '#1B2A4A' }]}>{complianceRate}%</Text>
            <Text style={styles.summaryLabel}>Cumplimiento</Text>
          </View>
        </View>
      </View>

      {/* Tabla de OT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Órdenes de Trabajo</Text>
        {workOrders.length === 0 ? (
          <Text style={styles.noData}>Sin órdenes de trabajo para este día</Text>
        ) : (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: '25%' }]}>Ruta</Text>
              <Text style={[styles.tableHeaderText, { width: '20%' }]}>Lubricador</Text>
              <Text style={[styles.tableHeaderText, { width: '15%' }]}>Estado</Text>
              <Text style={[styles.tableHeaderText, { width: '15%' }]}>Inicio</Text>
              <Text style={[styles.tableHeaderText, { width: '15%' }]}>Fin</Text>
              <Text style={[styles.tableHeaderText, { width: '10%', textAlign: 'right' }]}>%</Text>
            </View>
            {workOrders.map((wo, index) => (
              <View
                key={wo.id}
                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              >
                <Text style={[styles.tableCell, { width: '25%' }]}>{wo.route_name}</Text>
                <Text style={[styles.tableCell, { width: '20%' }]}>{wo.assigned_to_name}</Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>
                  {statusLabels[wo.status] || wo.status}
                </Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>
                  {formatTime(wo.started_at)}
                </Text>
                <Text style={[styles.tableCell, { width: '15%' }]}>
                  {formatTime(wo.completed_at)}
                </Text>
                <Text style={[styles.tableCell, { width: '10%', textAlign: 'right' }]}>
                  {wo.completion_percentage ?? 0}%
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Incidentes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Incidentes Reportados ({incidents.length})
        </Text>
        {incidents.length === 0 ? (
          <Text style={styles.noData}>Sin incidentes reportados</Text>
        ) : (
          incidents.map((inc) => (
            <View key={inc.id} style={styles.incidentCard}>
              <View style={styles.incidentHeader}>
                <Text style={styles.incidentType}>
                  {typeLabels[inc.type] || inc.type}
                </Text>
                <Text style={styles.incidentSeverity}>
                  {severityLabels[inc.severity] || inc.severity}
                </Text>
              </View>
              <Text style={styles.incidentDetail}>
                Punto: {inc.point_name} — Máquina: {inc.machine_name}
              </Text>
              {inc.description && (
                <Text style={styles.incidentDetail}>{inc.description}</Text>
              )}
              <Text style={[styles.incidentDetail, { color: '#999', marginTop: 4 }]}>
                Reportado por: {inc.reported_by_name}
              </Text>
            </View>
          ))
        )}
      </View>
    </ReportTemplate>
  );
}
