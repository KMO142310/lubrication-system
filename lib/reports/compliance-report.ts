import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ComplianceData {
    period: string; // "Semana 4, Enero 2026"
    contractorName: string;
    contractorRut: string;
    supervisorName: string;
    metrics: {
        totalRoutes: number;
        completedRoutes: number;
        adherencePercentage: number; // 98.7
        totalTasksScheduled: number;
        totalTasksExecuted: number;
        efficiencyPercentage: number;
    };
    delays: {
        date: string;
        reason: string;
        impact: string;
    }[];
}

export function generateComplianceReport(data: ComplianceData): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header Institucional
    doc.addImage('https://i.imgur.com/example-logo.png', 'PNG', 15, 10, 30, 10); // Placeholder
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138);
    doc.text('INFORME DE CUMPLIMIENTO DE SERVICIO', pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Periodo: ${data.period}`, pageWidth / 2, 32, { align: 'center' });

    // Tarjeta del Contratista
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.rect(15, 40, pageWidth - 30, 25, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text(`Empresa Contratista: ${data.contractorName}`, 20, 50);
    doc.text(`RUT: ${data.contractorRut}`, 20, 58);
    doc.text(`Supervisor Responsable: ${data.supervisorName}`, pageWidth - 80, 50);

    // KPI Principales (Círculos)
    const yKPI = 85;

    // Función helper para dibujar KPI
    const drawKPI = (x: number, label: string, value: string, color: [number, number, number]) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(1.5);
        doc.circle(x, yKPI, 18);
        doc.setTextColor(...color);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(value, x, yKPI + 3, { align: 'center' });
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(label, x, yKPI + 28, { align: 'center' });
    };

    drawKPI(45, 'Adherencia Rutas', `${data.metrics.adherencePercentage}%`, [34, 197, 94]);
    drawKPI(105, 'Tareas Ejecutadas', `${data.metrics.totalTasksExecuted}`, [59, 130, 246]);
    drawKPI(165, 'Eficiencia Global', `${data.metrics.efficiencyPercentage}%`, [249, 115, 22]);

    // Tabla de Detalle de Servicio
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text('DESGLOSE DE ACTIVIDAD', 15, 130);

    autoTable(doc, {
        startY: 135,
        head: [['Concepto', 'Valor']],
        body: [
            ['Rutas Programadas', data.metrics.totalRoutes],
            ['Rutas Cerradas a Tiempo', data.metrics.completedRoutes],
            ['Tareas Totales Planificadas', data.metrics.totalTasksScheduled],
            ['Tareas Efectivas Realizadas', data.metrics.totalTasksExecuted],
            ['Desviación Negativa', data.metrics.totalTasksScheduled - data.metrics.totalTasksExecuted]
        ],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50] }
    });

    // Tabla de Desviaciones (Si existen)
    if (data.delays.length > 0) {
        const finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.text('JUSTIFICACIÓN DE DESVIACIONES', 15, finalY);

        autoTable(doc, {
            startY: finalY + 5,
            head: [['Fecha', 'Motivo del Atraso / No Ejecución', 'Impacto Operacional']],
            body: data.delays.map(d => [d.date, d.reason, d.impact]),
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] }
        });
    }

    // Firmas
    const signY = 260;
    doc.setLineWidth(0.5);
    doc.setDrawColor(150, 150, 150);

    doc.line(30, signY, 90, signY);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Supervisor Contratista', 60, signY + 5, { align: 'center' });

    doc.line(120, signY, 180, signY);
    doc.text('Gerente de Contrato AISA', 150, signY + 5, { align: 'center' });

    doc.save(`SLA_${data.contractorName.replace(/ /g, '_')}_${data.period}.pdf`);
}
