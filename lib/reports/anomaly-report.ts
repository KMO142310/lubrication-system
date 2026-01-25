import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateAnomalyReportPDF(anomalies: {
    id: string;
    description: string;
    severity: string;
    status: string;
    machine?: string;
    point?: string;
    reporter: string;
    date: string;
}[]): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(220, 38, 38); // Red
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Anomalías', 14, 22);

    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-CL')}`, pageWidth - 14, 22, { align: 'right' });

    // Table
    const tableData = anomalies.map(a => [
        a.date,
        a.machine || a.point || '-',
        a.description.substring(0, 50) + (a.description.length > 50 ? '...' : ''),
        a.severity.toUpperCase(),
        a.status === 'resuelta' ? 'Resuelta' : a.status === 'en_revision' ? 'En Revisión' : 'Abierta',
        a.reporter,
    ]);

    autoTable(doc, {
        startY: 45,
        head: [['Fecha', 'Activo', 'Descripción', 'Severidad', 'Estado', 'Reportó']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [220, 38, 38],
            textColor: [255, 255, 255],
            fontSize: 9,
        },
        bodyStyles: {
            fontSize: 8,
        },
        margin: { left: 14, right: 14 },
    });

    doc.save(`reporte-anomalias-${new Date().toISOString().split('T')[0]}.pdf`);
}
