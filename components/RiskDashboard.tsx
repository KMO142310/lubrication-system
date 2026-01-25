import { AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

interface RiskMetricProps {
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    score: number;
    criticalCount: number;
    totalTasks: number;
}

export default function RiskDashboard({ riskLevel, score, criticalCount, totalTasks }: RiskMetricProps) {
    const getRiskConfig = () => {
        switch (riskLevel) {
            case 'CRITICAL':
                return { color: 'var(--red-500)', bg: 'var(--red-50)', icon: ShieldAlert, label: 'Riesgo Crítico' };
            case 'HIGH':
                return { color: 'var(--orange-500)', bg: 'var(--orange-50)', icon: AlertTriangle, label: 'Riesgo Alto' };
            case 'MODERATE':
                return { color: 'var(--yellow-500)', bg: 'var(--yellow-50)', icon: AlertTriangle, label: 'Riesgo Moderado' };
            case 'LOW':
            default:
                return { color: 'var(--green-500)', bg: 'var(--green-50)', icon: ShieldCheck, label: 'Sistema Seguro' };
        }
    };

    const config = getRiskConfig();
    const Icon = config.icon;

    return (
        <div className="card" style={{ borderLeft: `4px solid ${config.color}` }}>
            <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{
                                padding: '8px',
                                borderRadius: '8px',
                                background: config.bg,
                                color: config.color
                            }}>
                                <Icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold" style={{ color: config.color }}>{config.label}</h3>
                        </div>
                        <p className="text-sm text-muted">Base de Activos Críticos (Tipo A)</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div className="text-3xl font-bold">{score}</div>
                        <div className="text-xs text-muted">Puntaje de Riesgo</div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
                        <div className="text-xs text-gray-500">Activos Críticos en Riesgo</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700">{totalTasks}</div>
                        <div className="text-xs text-gray-500">Tareas Pendientes</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
