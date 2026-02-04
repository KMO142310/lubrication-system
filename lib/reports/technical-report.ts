import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { WorkOrder, Task, LubricationPoint, Machine, Component, Lubricant } from '@/lib/types';

// Module augmentation for jspdf-autotable
declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable: { finalY: number };
    }
}

interface TechnicalReportData {
    workOrder: WorkOrder;
    tasks: (Task & {
        lubricationPoint: LubricationPoint;
        machine: Machine;
        component: Component;
        lubricant: Lubricant;
    })[];
    technicianName: string;
    companyName: string;
}

export function generateTechnicalReport(data: TechnicalReportData): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // ==========================================
    // HEADER (Estilo Industrial / Técnico)
    // ==========================================
    doc.setFillColor(41, 50, 65); // Dark Slate
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORME TÉCNICO DE LUBRICACIÓN', margin, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`OT: ${data.workOrder.id.toUpperCase()}`, margin, 26);
    doc.text(`Fecha: ${data.workOrder.scheduledDate}`, margin, 32);

    // Badge de Estado
    doc.setFillColor(data.workOrder.status === 'completado' ? 34 : 200, data.workOrder.status === 'completado' ? 197 : 50, 94);
    doc.roundedRect(pageWidth - 50, 10, 35, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(data.workOrder.status.toUpperCase(), pageWidth - 45, 16.5);

    // ==========================================
    // RESUMEN OPERATIVO
    // ==========================================
    let y = 55;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Técnico Ejecutor: ${data.technicianName}`, margin, y);
    doc.text(`Empresa: ${data.companyName}`, pageWidth / 2, y);

    y += 15;

    // Métricas Rápidas
    const total = data.tasks.length;
    const completed = data.tasks.filter(t => t.status === 'completado').length;
    const compliance = Math.round((completed / total) * 100) || 0;

    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y - 5, pageWidth - (margin * 2), 20, 'F');

    doc.setFont('helvetica', 'bold');
    doc.text(`Tareas Totales: ${total}`, margin + 10, y + 8);
    doc.text(`Ejecutadas: ${completed}`, margin + 60, y + 8);
    doc.setTextColor(compliance >= 90 ? 22 : 180, compliance >= 90 ? 163 : 0, 74);
    doc.text(`Cumplimiento: ${compliance}%`, margin + 110, y + 8);
    doc.setTextColor(0, 0, 0);

    // ==========================================
    // DETALLE DE EJECUCIÓN (Tabla)
    // ==========================================
    y += 25;

    const tableBody = data.tasks.map(t => [
        t.lubricationPoint.code,
        `${t.machine.name}\n${t.component.name}`,
        t.lubricant.name,
        `${t.lubricationPoint.quantity} ${t.lubricationPoint.unit || 'ml'}`,
        t.quantityUsed ? `${t.quantityUsed}` : '-',
        t.status === 'completado' ? 'OK' : 'PEND'
    ]);

    autoTable(doc, {
        startY: y,
        head: [['Punto', 'Equipo / Componente', 'Lubricante', 'Requiere', 'Aplicado', 'Estado']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [41, 50, 65], fontSize: 9 },
        bodyStyles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 25, fontStyle: 'bold' },
            1: { cellWidth: 60 },
            5: { halign: 'center', fontStyle: 'bold' }
        },
        margin: { left: margin, right: margin }
    });

    // ==========================================
    // MURO DE EVIDENCIA (Fotos)
    // ==========================================
    let finalY = doc.lastAutoTable.finalY + 20;

    const tasksWithPhotos = data.tasks.filter(t => t.photoUrl && t.status === 'completado');

    if (tasksWithPhotos.length > 0) {
        if (finalY > pageHeight - 60) {
            doc.addPage();
            finalY = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(41, 50, 65);
        doc.text('EVIDENCIA FOTOGRÁFICA', margin, finalY);
        doc.setLineWidth(0.5);
        doc.line(margin, finalY + 2, pageWidth - margin, finalY + 2);

        finalY += 15;

        // Grid de fotos (2 por fila)
        let xPos = margin;
        const photoWidth = 80;
        const photoHeight = 60;
        const gap = 10;

        tasksWithPhotos.forEach((task, index) => {
            if (finalY + photoHeight + 30 > pageHeight) {
                doc.addPage();
                finalY = 20;
            }

            // Columna 2 reset
            if (index % 2 === 0) {
                xPos = margin;
            } else {
                xPos = margin + photoWidth + gap;
            }

            // Si es nueva fila (y no es el primero), y es par, bajar Y
            if (index > 0 && index % 2 === 0) {
                finalY += photoHeight + 35;
            }

            // Foto
            try {
                if (task.photoUrl) {
                    doc.addImage(task.photoUrl, 'JPEG', xPos, finalY, photoWidth, photoHeight);
                    doc.rect(xPos, finalY, photoWidth, photoHeight); // Borde
                }
            } catch (e) {
                doc.rect(xPos, finalY, photoWidth, photoHeight);
                doc.text('Img Error', xPos + 30, finalY + 30);
            }

            // Metadata Foto
            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
            doc.text(`${task.lubricationPoint.code}`, xPos, finalY + photoHeight + 5);
            doc.text(`${task.machine.name}`, xPos, finalY + photoHeight + 9);
            const obs = task.observations ? `Obs: ${task.observations}` : 'Sin observaciones';
            doc.text(obs.substring(0, 40), xPos, finalY + photoHeight + 13);
        });
    }

    doc.save(`AISA_Tecnico_${data.workOrder.scheduledDate}.pdf`);
}
