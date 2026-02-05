'use client';

import { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    AlertTriangle,
    Users,
    CheckCircle2,
    Calendar,
    MoreHorizontal,
    Filter
} from 'lucide-react';
import Link from 'next/link';

export default function SupervisorDashboard() {
    // Mock data for supervisor view
    const kpis = [
        { label: 'Cumplimiento Global', value: '87%', trend: '+2.5%', status: 'success' },
        { label: 'Anomalías Activas', value: '3', trend: '-1', status: 'warning' },
        { label: 'Rutas Completadas', value: '4/6', trend: 'En progreso', status: 'neutral' },
    ];

    const teamStatus = [
        { name: 'Omar Alexis', role: 'Lubricador', status: 'En Ruta', progress: 92, lastAction: 'Hace 5 min' },
        { name: 'Juan Pérez', role: 'Contratista', status: 'Pausa', progress: 45, lastAction: 'Hace 32 min' },
        { name: 'Carlos Díaz', role: 'Lubricador', status: 'Completado', progress: 100, lastAction: 'Hace 1 hora' },
    ];

    const anomalies = [
        { id: 1, machine: 'Molino SAG', desc: 'Temperatura elevada en rodamiento', severity: 'high', time: '10:30 AM' },
        { id: 2, machine: 'Cinta 004', desc: 'Fuga de grasa visible', severity: 'medium', time: '09:15 AM' },
    ];

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                <div>
                    <h1 className="text-xl font-bold text-white">Panel de Supervisión</h1>
                    <p className="text-slate-400 text-sm">Planta Concentradora • Turno A</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-premium btn-premium-ghost text-xs">
                        <Filter size={14} className="mr-2" />
                        Filtrar
                    </button>
                    <button className="btn-premium btn-premium-primary text-xs">
                        <Calendar size={14} className="mr-2" />
                        Esta Semana
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-3 gap-4">
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                        <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">{kpi.label}</div>
                        <div className="flex items-end justify-between">
                            <div className="text-2xl font-bold text-white">{kpi.value}</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${kpi.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                    kpi.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-slate-700 text-slate-300'
                                }`}>
                                {kpi.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1lg:grid-cols-2 gap-6 h-full">

                {/* Team Monitor */}
                <div className="card-glass p-0 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Users size={16} className="text-blue-400" />
                            Estado del Equipo
                        </h3>
                    </div>
                    <div className="flex-1 overflow-auto p-4 space-y-3">
                        {teamStatus.map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">{member.name}</div>
                                        <div className="text-xs text-slate-400">{member.role}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-mono text-blue-300">{member.progress}%</div>
                                    <div className="w-20 h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${member.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Anomalies Watch */}
                <div className="card-glass p-0 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <AlertTriangle size={16} className="text-yellow-500" />
                            Anomalías Recientes
                        </h3>
                        <Link href="/anomalies" className="text-xs text-blue-400 hover:text-blue-300">Ver todo</Link>
                    </div>
                    <div className="flex-1 overflow-auto p-4 space-y-3">
                        {anomalies.map((anomaly, idx) => (
                            <div key={idx} className="flex gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 group hover:border-slate-600 transition">
                                <div className={`w-1 h-full rounded-full ${anomaly.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-bold text-slate-200">{anomaly.machine}</span>
                                        <span className="text-xs text-slate-500">{anomaly.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">{anomaly.desc}</p>
                                </div>
                            </div>
                        ))}
                        {anomalies.length === 0 && (
                            <div className="text-center py-8 text-slate-500">Sin anomalías reportadas</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
