'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Play,
    CheckCircle2,
    QrCode,
    MapPin,
    Zap,
    Clock,
    Battery
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Task {
    id: string;
    code: string;
    machine: string;
    component: string;
    lubricant: string;
    status: 'pending' | 'completed';
}

export default function LubricatorDashboard() {
    const { user } = useAuth();
    const [progress, setProgress] = useState(65);

    // Mock data representing what the technician sees
    const nextTask: Task = {
        id: 't-123',
        code: 'LUB-001',
        machine: 'Cinta Transportadora Principal',
        component: 'Rodamiento de Cabeza',
        lubricant: 'Mobilgrease XHP 222',
        status: 'pending'
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* 1. Header with Personal Greeting & Status */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-display uppercase tracking-wide">
                        Hola, {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Sistema en Línea
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                    <Battery className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-mono text-green-400">92%</span>
                </div>
            </header>

            {/* 2. Hero Section: Daily Progress (Apple Fitness Style) */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700 shadow-2xl">
                <div className="flex items-center justify-between z-10 relative">
                    <div className="space-y-1">
                        <h2 className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold">Progreso Diario</h2>
                        <div className="text-4xl font-black text-white font-mono">{progress}%</div>
                        <p className="text-slate-400 text-sm">13 de 20 tareas completadas</p>
                    </div>

                    {/* Ring Visualization Mockup */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-500" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress) / 100} strokeLinecap="round" />
                        </svg>
                        <Zap className="absolute w-8 h-8 text-blue-400" fill="currentColor" />
                    </div>
                </div>

                {/* Decorative Background Blur */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
            </section>

            {/* 3. "Big Red Button" - Primary Action: Scan or Start Next */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Siguiente Tarea</h3>
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded font-mono">PRIORIDAD ALTA</span>
                </div>

                <Link href={`/tasks/${nextTask.id}`} className="block group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative bg-slate-800 border-l-4 border-blue-500 rounded-2xl p-6 hover:translate-y-[-2px] transition shadow-xl overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-2xl font-bold text-white mb-1">{nextTask.machine}</div>
                                <div className="text-lg text-slate-300 flex items-center gap-2">
                                    <MapPin size={18} className="text-slate-500" />
                                    {nextTask.component}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 rounded-xl p-4 flex items-center justify-between mb-4 border border-slate-700/50">
                            <span className="text-sm text-slate-400">Lubricante Requerido</span>
                            <span className="text-blue-400 font-bold">{nextTask.lubricant}</span>
                        </div>

                        <div className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-900/20">
                            <Play fill="currentColor" />
                            COMENZAR AHORA
                        </div>
                    </div>
                </Link>
            </section>

            {/* 4. Quick Actions Grid */}
            <section className="grid grid-cols-2 gap-4">
                <button className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-3 hover:bg-slate-750 transition active:scale-95">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                        <QrCode className="text-white w-6 h-6" />
                    </div>
                    <span className="font-semibold text-slate-300">Escanear QR</span>
                </button>

                <Link href="/tasks" className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-3 hover:bg-slate-750 transition active:scale-95">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                        <CheckCircle2 className="text-green-400 w-6 h-6" />
                    </div>
                    <span className="font-semibold text-slate-300">Mis Tareas</span>
                </Link>
            </section>

            {/* 5. Date & Route Info */}
            <div className="mt-auto text-center pb-8 opacity-50">
                <p className="text-xs text-slate-500 font-mono">
                    RUTA ACTIVA: NAVE PRINCIPAL • {format(new Date(), 'dd MMM yyyy', { locale: es })}
                </p>
            </div>
        </div>
    );
}
