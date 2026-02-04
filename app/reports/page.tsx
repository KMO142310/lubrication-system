'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FileText, Download, Briefcase, TrendingUp, Settings } from 'lucide-react';
import { generateTechnicalReport, generateComplianceReport, generateExecutiveSummary } from '@/lib/pdf';
import { useAuth } from '@/lib/auth';
import { dataService } from '@/lib/data';
import toast from 'react-hot-toast';

// Add CSS for fade-in animation
const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function ReportsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);

    const handleDownload = async (reportType: 'technical' | 'compliance' | 'executive') => {
        setLoading(true);
        setSelectedReport(reportType);
        toast.loading('Generando documento...', { id: 'report-gen' });

        try {
            await new Promise(r => setTimeout(r, 1200)); // Cinematic delay

            if (reportType === 'technical') {
                const orders = dataService.getWorkOrders();
                const firstOrder = orders[0];

                if (!firstOrder) throw new Error('No existen órdenes de trabajo para generar informe.');

                const tasks = dataService.getTasks(firstOrder.id);
                const enrichedTasks = tasks.map(t => {
                    const lp = dataService.getLubricationPoints().find(p => p.id === t.lubricationPointId)!;
                    const comp = dataService.getComponents().find(c => c.id === lp.componentId)!;
                    const mach = dataService.getMachines().find(m => m.id === comp.machineId)!;
                    const lub = dataService.getLubricants().find(l => l.id === lp.lubricantId)!;

                    return { ...t, lubricationPoint: lp, machine: mach, component: comp, lubricant: lub };
                });

                generateTechnicalReport({
                    workOrder: firstOrder,
                    tasks: enrichedTasks,
                    technicianName: user?.name || 'Técnico AISA',
                    companyName: 'AISA Planta Principal'
                });
            }
            else if (reportType === 'compliance') {
                generateComplianceReport({
                    period: 'Enero 2026',
                    contractorName: 'Servicios Industriales PRO',
                    contractorRut: '76.123.456-K',
                    supervisorName: user?.name || 'Supervisor Externo',
                    metrics: {
                        totalRoutes: 20,
                        completedRoutes: 19,
                        adherencePercentage: 95,
                        totalTasksScheduled: 450,
                        totalTasksExecuted: 442,
                        efficiencyPercentage: 98.2
                    },
                    delays: [
                        { date: '2026-01-15', reason: 'Falta de Repuesto', impact: 'Bajo' }
                    ]
                });
            }
            else if (reportType === 'executive') {
                generateExecutiveSummary({
                    month: 'Enero 2026',
                    riskScore: 15,
                    riskLevel: 'BAJO',
                    financials: {
                        totalBudget: 5000000,
                        totalSpent: 4200000,
                        savings: 800000,
                        currency: 'CLP'
                    },
                    topBadActors: [
                        { machine: 'Descortezador LG', spent: 1200000, issuesCount: 4 },
                        { machine: 'Cinta Transportadora 4', spent: 650000, issuesCount: 2 },
                        { machine: 'Sierra Huincha Principal', spent: 500000, issuesCount: 1 }
                    ]
                });
            }

            toast.success(`${reportType.toUpperCase()} descargado`, { id: 'report-gen' });
        } catch (error) {
            toast.error('Error: ' + (error as Error).message, { id: 'report-gen' });
        } finally {
            setLoading(false);
            setSelectedReport(null);
        }
    };

    const reports = [
        {
            id: 'technical',
            title: 'Informe Técnico',
            description: 'Detalle operativo ruta a ruta. Incluye evidencia fotográfica y firmas.',
            icon: FileText,
            role: 'lubricador',
            color: 'blue'
        },
        {
            id: 'compliance',
            title: 'Cumplimiento Contratista',
            description: 'Analísis de SLA, adherencia a rutas y justificación de desviaciones.',
            icon: Briefcase,
            role: 'supervisor',
            color: 'orange'
        },
        {
            id: 'executive',
            title: 'Resumen Ejecutivo',
            description: 'KPIs financieros, semáforo de riesgo y salud de activos para gerencia.',
            icon: TrendingUp,
            role: 'supervisor',
            color: 'emerald'
        }
    ];

    return (
        <ProtectedRoute>
            <style>{fadeIn}</style>
            <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                    <div className="page-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Centro de Informes</h1>
                        <p className="text-gray-500 mb-8">Descargue reportes profesionales optimizados para cada nivel jerárquico.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {reports.map((report, idx) => (
                                <div
                                    key={report.id}
                                    className={`card hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-${report.color}-500 transform hover:-translate-y-1`}
                                    style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.1}s backwards` }}
                                    onClick={() => !loading && handleDownload(report.id as 'technical' | 'compliance' | 'executive')}
                                >
                                    <div className="card-body relative overflow-hidden">
                                        {/* Background decoration */}
                                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${report.color}-50 rounded-full opacity-50 z-0`}></div>

                                        <div className={`relative z-10 p-3 rounded-lg bg-${report.color}-50 w-fit mb-4 shadow-sm`}>
                                            <report.icon className={`text-${report.color}-600`} size={32} />
                                        </div>

                                        <h3 className="relative z-10 text-xl font-bold text-gray-800 mb-2">{report.title}</h3>
                                        <p className="relative z-10 text-sm text-gray-500 mb-6 min-h-[40px]">
                                            {report.description}
                                        </p>

                                        <button
                                            className={`btn w-full transition-colors ${loading && selectedReport === report.id ? 'bg-gray-400 cursor-wait' : 'btn-primary'}`}
                                            disabled={loading}
                                        >
                                            {loading && selectedReport === report.id ? (
                                                <span className="flex items-center justify-center">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Preparando...
                                                </span>
                                            ) : (
                                                <>
                                                    <Download size={18} className="mr-2" />
                                                    Generar PDF
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Preview Section */}
                        <div className="mt-12 p-8 border-2 border-dashed border-gray-200 rounded-xl text-center bg-gray-50/50">
                            <Settings className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-500">Vista Previa Inteligente</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                El sistema seleccionará automáticamente los datos más relevantes del periodo actual para generar su informe.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
