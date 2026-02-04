'use client';

import { useState, use, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ZoomIn, ZoomOut, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { dataService } from '@/lib/data';
import { generateMachineSVG } from '@/lib/diagrams';
import { Machine } from '@/lib/types';
import toast from 'react-hot-toast';

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [machine, setMachine] = useState<Machine | null>(null);
    const [svgContent, setSvgContent] = useState<string>('');
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        dataService.init();
        const m = dataService.getMachines().find(m => m.id === resolvedParams.id);
        if (m) {
            setMachine(m);
            const svg = generateMachineSVG(m.id);
            setSvgContent(svg);
        }
    }, [resolvedParams.id]);

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));

    if (!machine) {
        return <div className="p-8 text-center">Cargando plano...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/plans">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {machine.name}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            ID: {machine.id} • {machine.make || 'Genérico'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => {
                        const newSvg = generateMachineSVG(machine.id);
                        setSvgContent(newSvg);
                        toast.success('Diagrama regenerado');
                    }}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Regenerar
                    </Button>
                    <Button variant="secondary">
                        <Download className="mr-2 h-4 w-4" /> Exportar PDF
                    </Button>
                </div>
            </div>

            {/* Main Viewer */}
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden h-[75vh] flex flex-col">
                <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                            Vista Vectorial Esquema (Generado Automáticamente)
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-xs w-12 text-center">{(zoom * 100).toFixed(0)}%</span>
                        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <CardContent className="flex-1 p-0 bg-slate-100 dark:bg-slate-900 relative overflow-auto flex items-center justify-center">

                    <div
                        className="transition-transform duration-200 ease-out origin-center p-8 bg-white shadow-lg"
                        style={{ transform: `scale(${zoom})` }}
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />

                </CardContent>
            </Card>

            {/* Description / Metadata */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">Detalles Técnicos</h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            Diagrama esquemático generado en tiempo real basado en la estructura de componentes y puntos de lubricación definida en la base de datos maestra. Refleja fielmente la configuración actual del equipo.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Leyenda</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div>Punto Manual</span>
                            </div>
                            <div className="flex items-center justify-between text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Punto Auto/Central</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
