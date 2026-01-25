'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TaskPhoto {
    taskCode: string;
    taskDescription: string;
    photoUrl: string;
    capturedAt: string;
    type: 'antes' | 'despues';
}

interface WorkOrderPDFData {
    code: string;
    date: string;
    technician: string;
    company?: string;
    plant?: string;
    shift?: string;
    tasks: {
        code: string;
        machine: string;
        component: string;
        lubricant: string;
        method: string;
        quantityRequired?: string;
        quantityUsed?: string;
        status: string;
        observations?: string;
        photoUrl?: string;
        completedAt?: string;
        frequency?: string;
    }[];
    photos?: TaskPhoto[];
    signature?: string;
    completedAt?: string;
    totalTasks?: number;
    completedTasks?: number;
}

export function generateWorkOrderPDF(data: WorkOrderPDFData): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ============================================================
    // PÁGINA 1: INFORME DE LUBRICACIÓN (ISO 55001 / ICML)
    // ============================================================

    // Header con logo y título
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME DE LUBRICACIÓN', 14, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Conforme ISO 55001 - Gestión de Activos', 14, 26);
    doc.text('Sistema de Control de Lubricación Industrial', 14, 33);

    // Código de orden
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.code, pageWidth - 14, 18, { align: 'right' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${data.date}`, pageWidth - 14, 28, { align: 'right' });

    // Información general en recuadro
    let y = 55;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(14, y - 5, pageWidth - 28, 35, 'S');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DE LA RUTA', 16, y + 2);

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const col1 = 16;
    const col2 = pageWidth / 2 + 5;

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Técnico Responsable:', col1, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.technician, col1 + 38, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Empresa:', col2, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.company || 'AISA', col2 + 20, y);

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Planta:', col1, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.plant || 'AISA - Aserraderos Industriales', col1 + 18, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Turno:', col2, y);
    doc.setFont('helvetica', 'normal');
    doc.text(data.shift || 'Diurno', col2 + 15, y);

    // Resumen de cumplimiento
    y += 20;
    const compliance = data.totalTasks && data.totalTasks > 0
        ? Math.round((data.completedTasks || 0) / data.totalTasks * 100)
        : 0;

    doc.setFillColor(compliance >= 90 ? 34 : compliance >= 70 ? 234 : 239,
        compliance >= 90 ? 197 : compliance >= 70 ? 179 : 68,
        compliance >= 90 ? 94 : compliance >= 70 ? 8 : 68);
    doc.rect(14, y, pageWidth - 28, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`CUMPLIMIENTO: ${compliance}%`, 20, y + 8);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.completedTasks || 0} de ${data.totalTasks || 0} tareas ejecutadas`, 20, y + 15);

    doc.setFont('helvetica', 'bold');
    doc.text(compliance >= 90 ? 'CONFORME' : compliance >= 70 ? 'PARCIAL' : 'NO CONFORME',
        pageWidth - 20, y + 12, { align: 'right' });

    // Tabla de tareas
    y += 30;
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DETALLE DE TAREAS EJECUTADAS', 14, y);

    const tableData = data.tasks.map((task, idx) => [
        String(idx + 1),
        task.code,
        task.machine.substring(0, 20),
        task.component.substring(0, 18),
        task.lubricant.substring(0, 18),
        task.method,
        task.quantityUsed || '-',
        task.status === 'completado' ? '✓' : task.status === 'omitido' ? '✗' : '○',
    ]);

    autoTable(doc, {
        startY: y + 5,
        head: [['#', 'Código', 'Equipo', 'Componente', 'Lubricante', 'Método', 'Cant.', 'OK']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [30, 58, 138],
            textColor: [255, 255, 255],
            fontSize: 7,
            fontStyle: 'bold',
            halign: 'center',
        },
        bodyStyles: {
            fontSize: 6,
            halign: 'center',
        },
        columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 22, halign: 'left' },
            2: { cellWidth: 30, halign: 'left' },
            3: { cellWidth: 28, halign: 'left' },
            4: { cellWidth: 28, halign: 'left' },
            5: { cellWidth: 20 },
            6: { cellWidth: 15 },
            7: { cellWidth: 10 },
        },
        margin: { left: 14, right: 14 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    // Observaciones si hay
    const tasksWithObs = data.tasks.filter(t => t.observations);
    let finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

    if (tasksWithObs.length > 0 && finalY < pageHeight - 80) {
        finalY += 10;
        doc.setTextColor(30, 58, 138);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES:', 14, finalY);

        finalY += 6;
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);

        tasksWithObs.slice(0, 5).forEach(task => {
            doc.text(`• ${task.code}: ${task.observations?.substring(0, 80)}`, 14, finalY);
            finalY += 5;
        });
    }

    // Sección de firmas
    finalY = Math.max(finalY + 15, pageHeight - 50);

    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.3);

    // Firma técnico
    doc.line(14, finalY + 20, 80, finalY + 20);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Firma Técnico Ejecutor', 14, finalY + 26);
    doc.text(data.technician, 14, finalY + 32);

    if (data.signature) {
        try {
            doc.addImage(data.signature, 'PNG', 14, finalY - 5, 60, 25);
        } catch (_e) {
            // Firma no disponible
        }
    }

    // Firma supervisor (espacio)
    doc.line(pageWidth - 80, finalY + 20, pageWidth - 14, finalY + 20);
    doc.text('Firma Supervisor', pageWidth - 80, finalY + 26);
    doc.text('_________________', pageWidth - 80, finalY + 32);

    // Hora de cierre
    if (data.completedAt) {
        doc.setFontSize(8);
        doc.text(`Cerrado: ${data.completedAt}`, pageWidth / 2, finalY + 32, { align: 'center' });
    }

    // ANEXO DE EVIDENCIA FOTOGRÁFICA (Anti-Fraude)
    const tasksWithPhotos = data.tasks.filter(t => t.photoUrl && t.status === 'completado');

    if (tasksWithPhotos.length > 0 || (data.photos && data.photos.length > 0)) {
        doc.addPage();

        // Header del anexo
        doc.setFillColor(30, 58, 138);
        doc.rect(0, 0, pageWidth, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('ANEXO: EVIDENCIA FOTOGRÁFICA', 14, 18);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Sistema Anti-Fraude AISA', pageWidth - 14, 18, { align: 'right' });

        let photoY = 45;
        const photoWidth = 80;
        const photoHeight = 60;

        // Fotos de tareas completadas
        tasksWithPhotos.forEach((task, _index) => {
            if (photoY > 220) {
                doc.addPage();
                photoY = 20;
            }

            // Info de la tarea
            doc.setTextColor(30, 58, 138);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(`Tarea ${task.code} - ${task.component}`, 14, photoY);

            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(`Máquina: ${task.machine} | Lubricante: ${task.lubricant}`, 14, photoY + 6);

            if (task.completedAt) {
                doc.text(`Capturada: ${task.completedAt}`, 14, photoY + 11);
            }

            // Foto
            if (task.photoUrl) {
                try {
                    doc.addImage(task.photoUrl, 'JPEG', 14, photoY + 15, photoWidth, photoHeight);

                    // Marco de verificación
                    doc.setDrawColor(34, 197, 94);
                    doc.setLineWidth(1);
                    doc.rect(14, photoY + 15, photoWidth, photoHeight);

                    // Badge de verificado
                    doc.setFillColor(34, 197, 94);
                    doc.rect(14, photoY + 15, 25, 8, 'F');
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(6);
                    doc.text('VERIFICADO', 16, photoY + 21);
                } catch (_e) {
                    doc.setTextColor(200, 100, 100);
                    doc.text('[Foto no disponible]', 14, photoY + 40);
                }
            }

            photoY += photoHeight + 30;
        });

        // Fotos adicionales del array photos
        if (data.photos && data.photos.length > 0) {
            data.photos.forEach((photo) => {
                if (photoY > 220) {
                    doc.addPage();
                    photoY = 20;
                }

                doc.setTextColor(30, 58, 138);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(`${photo.type === 'antes' ? 'ANTES' : 'DESPUÉS'} - Tarea ${photo.taskCode}`, 14, photoY);

                doc.setTextColor(100, 100, 100);
                doc.setFontSize(8);
                doc.text(`${photo.taskDescription}`, 14, photoY + 6);
                doc.text(`Capturada: ${photo.capturedAt}`, 14, photoY + 11);

                try {
                    doc.addImage(photo.photoUrl, 'JPEG', 14, photoY + 15, photoWidth, photoHeight);
                    doc.setDrawColor(30, 58, 138);
                    doc.setLineWidth(0.5);
                    doc.rect(14, photoY + 15, photoWidth, photoHeight);
                } catch (_e) {
                    doc.text('[Foto no disponible]', 14, photoY + 40);
                }

                photoY += photoHeight + 30;
            });
        }
    }

    // Footer en cada página
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFillColor(245, 245, 245);
        doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
        );
    }

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
}

