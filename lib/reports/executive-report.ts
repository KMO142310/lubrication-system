import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExecutiveData {
    month: string;
    riskScore: number; // 0-100
    riskLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRÍTICO';
    financials: {
        totalBudget: number;
        totalSpent: number;
        savings: number;
        currency: string;
    };
    topBadActors: {
        machine: string;
        spent: number;
        issuesCount: number;
    }[];
}

export function generateExecutiveSummary(data: ExecutiveData): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Fondo Header Elegante
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, pageWidth, 50, 'F');

    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN EJECUTIVO', 15, 25);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text('Estado de Salud de Activos y Financiero', 15, 33);

    doc.text(data.month.toUpperCase(), pageWidth - 15, 25, { align: 'right' });

    // Riesgo Global (Semáforo)
    let riskColor: [number, number, number] = [34, 197, 94]; // Green
    if (data.riskLevel === 'ALTO') riskColor = [234, 179, 8];
    if (data.riskLevel === 'CRÍTICO') riskColor = [220, 38, 38];

    doc.setFillColor(...riskColor);
    doc.circle(pageWidth - 25, 38, 4, 'F');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`RIESGO: ${data.riskLevel}`, pageWidth - 32, 40, { align: 'right' });

    // ==========================================
    // SECCIÓN 1: FINANZAS (EL DINERO)
    // ==========================================
    let y = 70;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EJECUCIÓN PRESUPUESTARIA', 15, y);

    // Cards Financieras Simples
    const drawCard = (x: number, title: string, value: string, sub: string) => {
        doc.setFillColor(248, 250, 252);
        doc.rect(x, y + 10, 55, 30, 'F');
        doc.setFontSize(20);
        doc.text(value, x + 27.5, y + 23, { align: 'center' });
        doc.setFontSize(9);
        doc.setTextColor(100, 110, 120);
        doc.text(title, x + 27.5, y + 33, { align: 'center' });
    };

    const fmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: data.financials.currency });

    drawCard(15, 'Gasto Real', fmt.format(data.financials.totalSpent), '');
    drawCard(80, 'Presupuesto', fmt.format(data.financials.totalBudget), '');
    drawCard(145, 'Variación', `${data.financials.savings > 0 ? '+' : ''}${fmt.format(data.financials.savings)}`, '');

    // ==========================================
    // SECCIÓN 2: TOP "BAD ACTORS" (Donde se va la plata)
    // ==========================================
    y += 60;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text('TOP 5 ACTIVOS CRÍTICOS (CONSUMO Y FALLAS)', 15, y);

    const tableData = data.topBadActors.map(actor => [
        actor.machine,
        fmt.format(actor.spent),
        actor.issuesCount,
        actor.issuesCount > 3 ? 'CRÍTICO' : 'ALERTA'
    ]);

    autoTable(doc, {
        startY: y + 10,
        head: [['Activo', 'Gasto Mensual', 'Fallas Rep.', 'Estado']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], fontSize: 10 },
        columnStyles: {
            0: { fontStyle: 'bold' },
            3: { halign: 'center', textColor: [220, 38, 38], fontStyle: 'bold' }
        }
    });

    // ==========================================
    // CONCLUSIÓN INTELIGENTE
    // ==========================================
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFillColor(240, 253, 244); // Green 50
    doc.rect(15, finalY, pageWidth - 30, 30, 'F');
    doc.setDrawColor(22, 163, 74);
    doc.rect(15, finalY, pageWidth - 30, 30, 'S');

    doc.setTextColor(21, 128, 61);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMENDACIÓN DEL SISTEMA', 20, finalY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    const recomendation = data.financials.savings < 0
        ? "El gasto excede el presupuesto. Se recomienda auditar las frecuencias de lubricación de los 'Bad Actors' listados arriba."
        : "La operación está bajo control financiero. Se sugiere mantener el plan actual y evaluar extensión de vida útil de aceites mediante análisis.";

    doc.text(doc.splitTextToSize(recomendation, pageWidth - 40), 20, finalY + 16);

    doc.save(`Executive_Summary_${data.month}.pdf`);
}
