'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Cog } from 'lucide-react';
import Link from 'next/link';
import { dataService } from '@/lib/data';
import Sidebar from '@/components/Sidebar';

export default function PlansPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [plans, setPlans] = useState<{ id: string, name: string, description: string }[]>([]);

    useEffect(() => {
        dataService.init();
        const machines = dataService.getMachines();
        const components = dataService.getComponents();

        const plansData = machines.map(m => {
            const mComps = components.filter(c => c.machineId === m.id);
            return {
                id: m.id,
                name: m.name,
                description: `${m.make || 'Genérico'} - ${mComps.length} Componentes registrados.`
            };
        });
        setPlans(plansData);
    }, []);

    const filteredPlans = plans.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <div className="page-container" style={{ padding: '24px' }}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                Planos Técnicos
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">
                                Diagramas esquemáticos generados automáticamente a partir de datos maestros.
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full max-w-sm items-center space-x-2 mb-8">
                        <Input
                            type="search"
                            placeholder="Buscar planos por equipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white dark:bg-slate-950"
                        />
                        <Button type="submit" size="icon" variant="ghost">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPlans.map((plan) => (
                            <Link key={plan.id} href={`/plans/${plan.id}`}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200 dark:border-slate-800 h-full">
                                    <div className="aspect-video w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden rounded-t-lg flex items-center justify-center">
                                        <Cog className="h-16 w-16 text-slate-400 opacity-50" />
                                        <div className="absolute top-2 right-2">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                                                Vectorizado
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
                                        <p className="text-xs text-slate-400 mt-4">
                                            Fuente: Base de Datos Maestra
                                        </p>
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
