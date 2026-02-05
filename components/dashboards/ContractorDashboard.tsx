'use client';

import {
    ClipboardList,
    MapPin,
    Clock,
    CheckSquare,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function ContractorDashboard() {
    const { user } = useAuth();

    // Mock tasks assignments
    const assignments = [
        { id: 'ot-881', title: 'Mantenimiento Preventivo Cinta 3', area: 'Chancado', status: 'pending', time: '08:00 - 12:00' },
        { id: 'ot-882', title: 'Engrase Motores Principales', area: 'Molienda', status: 'completed', time: '13:00 - 15:00' },
    ];

    return (
        <div className="flex flex-col h-full space-y-6">
            <header className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {user?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white mb-1">Portal Contratista</h1>
                        <p className="text-slate-400 text-sm">Empresa: {user?.contractorId || 'Externa'}</p>
                        <div className="mt-2 text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded inline-block font-mono">
                            ACCESO LIMITADO
                        </div>
                    </div>
                </div>
            </header>

            <section>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <ClipboardList className="text-orange-500" />
                    Órdenes de Trabajo Asignadas
                </h2>

                <div className="space-y-4">
                    {assignments.map(task => (
                        <div key={task.id} className={`p-4 rounded-xl border ${task.status === 'completed' ? 'bg-slate-900 border-green-900/50 opacity-75' : 'bg-slate-800 border-slate-700'
                            }`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-mono text-xs text-slate-500">{task.id.toUpperCase()}</span>
                                {task.status === 'completed' ? (
                                    <span className="text-green-500 flex items-center gap-1 text-xs font-bold bg-green-900/20 px-2 py-1 rounded">
                                        <CheckSquare size={12} /> COMPLETADO
                                    </span>
                                ) : (
                                    <span className="text-orange-500 flex items-center gap-1 text-xs font-bold bg-orange-900/20 px-2 py-1 rounded">
                                        <Clock size={12} /> PENDIENTE
                                    </span>
                                )}
                            </div>
                            <h3 className="text-white font-bold mb-2">{task.title}</h3>
                            <div className="flex gap-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><MapPin size={12} /> {task.area}</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {task.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="mt-auto bg-blue-900/20 border border-blue-800 p-4 rounded-xl flex gap-3">
                <AlertCircle className="text-blue-400 shrink-0" />
                <p className="text-xs text-blue-200">
                    Recuerde sincronizar sus datos al finalizar el turno antes de salir de la zona de cobertura WiFi.
                </p>
            </div>
        </div>
    );
}
