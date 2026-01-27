'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, Cog, CheckCircle2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

export default function PlansPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // Only show plans that are actually RESTORED and REAL
    const restoredPlans = [
        {
            id: 'eq-8001',
            name: 'Descortezador Línea Gruesa (8001)',
            description: 'Vista esquemática restaurada con flujo de materiales y componentes hidráulicos.',
            status: 'vectorized'
        }
    ];

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <div className="page-container" style={{ padding: '24px' }}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Planos Técnicos Restauraudos
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Diagramas vectoriales de alta fidelidad generados por el Workflow de Restauración.
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full max-w-sm items-center space-x-2 mb-8">
                        <Input
                            type="search"
                            placeholder="Buscar planos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white dark:bg-slate-950"
                        />
                        <Button type="submit" size="icon" variant="ghost">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restoredPlans.map((plan) => (
                            <Link key={plan.id} href={`/plans/${plan.id}`}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200 dark:border-slate-800 h-full">
                                    <div className="aspect-video w-full bg-slate-900 relative overflow-hidden rounded-t-lg flex items-center justify-center">
                                        {/* Preview visual */}
                                        <svg viewBox="0 0 200 120" className="w-full h-full opacity-50">
                                            <rect x="20" y="40" width="40" height="40" fill="#334155" />
                                            <circle cx="100" cy="60" r="30" fill="none" stroke="#334155" strokeWidth="2" />
                                            <rect x="140" y="40" width="30" height="40" fill="#334155" />
                                            <line x1="60" y1="60" x2="140" y2="60" stroke="#475569" strokeWidth="2" />
                                        </svg>

                                        <div className="absolute top-2 right-2">
                                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Verificado
                                            </span>
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                            {plan.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600">SVG Interactivo</span>
                                            <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600">Datos Reales</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
