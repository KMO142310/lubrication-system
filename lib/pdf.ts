'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface WorkOrderPDFData {
    code: string;
    date: string;
    technician: string;
    company?: string;
    tasks: {
        code: string;
        machine: string;
        component: string;
        lubricant: string;
        method: string;
        quantityRequired?: string; // Solo si está en plan detallado
        quantityUsed?: string; // Lo que realmente se usó
        status: string;
        observations?: string;
    }[];
    signature?: string;
    completedAt?: string;
    totalTasks?: number;
    completedTasks?: number;
}

export function generateWorkOrderPDF(data: WorkOrderPDFData): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(30, 58, 138); // Primary blue
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AISA Lubricación', 14, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Orden de Trabajo', 14, 30);

    // Work Order Info Box
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.code, pageWidth - 14, 20, { align: 'right' });

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text(data.date, pageWidth - 14, 30, { align: 'right' });

    // Info Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    let y = 55;

    doc.setFont('helvetica', 'bold');
    doc.text('Técnico:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.technician, 50, y);

    if (data.company) {
        y += 8;
        doc.setFont('helvetica', 'bold');
        doc.text('Empresa:', 14, y);
        doc.setFont('helvetica', 'normal');
        doc.text(data.company, 50, y);
    }

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.date, 50, y);

    // Summary
    y += 15;
    if (data.totalTasks && data.completedTasks !== undefined) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`Resumen: ${data.completedTasks} de ${data.totalTasks} tareas completadas`, 14, y);
        y += 5;
    }

    // Tasks Table
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Tareas Ejecutadas', 14, y);

    const tableData = data.tasks.map(task => [
        task.code,
        task.machine,
        task.component,
        task.lubricant,
        task.method,
        task.quantityUsed || task.quantityRequired || '-',
        task.status === 'completado' ? '✓' : task.status === 'omitido' ? '—' : '○',
        task.observations || '-',
    ]);

    autoTable(doc, {
        startY: y + 5,
        head: [['Código', 'Máquina', 'Componente', 'Lubricante', 'Método', 'Cant. Usada', 'Estado', 'Obs.']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: [30, 58, 138],
            textColor: [255, 255, 255],
            fontSize: 7,
            fontStyle: 'bold',
        },
        bodyStyles: {
            fontSize: 6,
        },
        columnStyles: {
            0: { cellWidth: 18 },
            1: { cellWidth: 28 },
            2: { cellWidth: 25 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 18 },
            6: { cellWidth: 12, halign: 'center' },
            7: { cellWidth: 30 },
        },
        margin: { left: 14, right: 14 },
    });

    // Signature Section
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

    if (data.signature) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(14, finalY + 25, 80, finalY + 25);

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Firma del Técnico', 14, finalY + 32);

        // Add signature image
        doc.addImage(data.signature, 'PNG', 14, finalY, 60, 25);
    }

    if (data.completedAt) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Completado: ${data.completedAt}`, pageWidth - 14, finalY + 32, { align: 'right' });
    }

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(245, 245, 245);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
        `Generado el ${new Date().toLocaleString('es-CL')} | Sistema AISA Lubricación`,
        pageWidth / 2,
        pageHeight - 6,
        { align: 'center' }
    );

    // Save
    doc.save(`orden-trabajo-${data.code}.pdf`);
}

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
