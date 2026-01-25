'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Plus } from 'lucide-react';
import Link from 'next/link';

// Real data using the extracted equipment and created SVG diagrams
const PLANS_DATA = [
    {
        id: '1',
        name: 'Plano 8006 - Línea de Producción',
        description: 'Diagrama vectorizado de la línea de producción con descortezador, scanner, pateadores y clasificador. 8 puntos de lubricación.',
        imageUrl: '/diagrams/8006-layout.svg',
        status: 'Vectorizado',
        updatedAt: '2026-01-25',
    },
    {
        id: '2',
        name: 'Layout Aserradero - Boceto Digitalizado',
        description: 'Boceto original de WhatsApp digitalizado. Grúa Sh47, transportes h1/h2/h22, unidad S10 y 6 puntos de lubricación.',
        imageUrl: '/diagrams/boceto-layout.svg',
        status: 'Vectorizado',
        updatedAt: '2026-01-25',
    },
    {
        id: '3',
        name: 'Codificación Equipos Foresa',
        description: 'Tabla de codificación original. Áreas 8000-8003 (Cancha, Descortezadores, Extracción Corteza).',
        imageUrl: '/reference-images/codificacion-equipos-foresa.jpeg',
        status: 'Referencia',
        updatedAt: '2026-01-24',
    },
];

export default function PlansPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Planos Técnicos
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Gestión y visualización de diagramas vectorizados.
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Plano
                </Button>
            </div>

            <div className="flex w-full max-w-sm items-center space-x-2">
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
                {PLANS_DATA.map((plan) => (
                    <Link key={plan.id} href={`/plans/${plan.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-slate-200 dark:border-slate-800 h-full">
                            <div className="aspect-video w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden rounded-t-lg flex items-center justify-center">
                                {plan.imageUrl ? (
                                    <img
                                        src={plan.imageUrl}
                                        alt={plan.name}
                                        className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <FileText className="h-16 w-16 text-slate-400" />
                                )}
                                <div className="absolute top-2 right-2">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${plan.status === 'Vectorizado'
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                            }`}
                                    >
                                        {plan.status}
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
                                    Actualizado: {plan.updatedAt}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
