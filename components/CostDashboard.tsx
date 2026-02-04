import { Coins } from 'lucide-react';

interface CostMetricProps {
    monthlyTotal: string; // Formatted currency string
    dailyAverage: string;
    topSpenderMachine: string;
    lubricantUsageLiters: number;
}

export default function CostDashboard({ monthlyTotal, dailyAverage, topSpenderMachine, lubricantUsageLiters }: CostMetricProps) {
    return (
        <div className="card" style={{ borderLeft: '4px solid var(--emerald-500)' }}>
            <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            padding: '8px',
                            borderRadius: '8px',
                            background: 'var(--emerald-50)',
                            color: 'var(--emerald-600)'
                        }}>
                            <Coins size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Gasto Operacional</h3>
                            <p className="text-sm text-muted">Costos de Lubricación (Mes Actual)</p>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div className="text-3xl font-bold text-emerald-600">{monthlyTotal}</div>
                        <div className="text-xs text-muted">Total Acumulado</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Promedio Diario</div>
                        <div className="text-lg font-bold text-gray-700">{dailyAverage}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Mayor Consumo</div>
                        <div className="text-lg font-bold text-gray-700 truncate" title={topSpenderMachine}>{topSpenderMachine}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Volumen Total</div>
                        <div className="text-lg font-bold text-gray-700">{lubricantUsageLiters.toFixed(1)} L/Kg</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
