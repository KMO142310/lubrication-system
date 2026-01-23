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
        tasksWithPhotos.forEach((task, index) => {
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
                } catch (e) {
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
                } catch (e) {
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
            `Generado el ${new Date().toLocaleString('es-CL')} | Sistema AISA Lubricación | Página ${i} de ${totalPages}`,
            pageWidth / 2,
            pageHeight - 6,
            { align: 'center' }
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

    doc.save(`reporte-anomalias-${new Date().toISOString().split('T')[0]}.pdf`);
}
