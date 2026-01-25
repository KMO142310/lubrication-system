'use client';

import { useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ZoomIn, ZoomOut, Download, PenTool, Eye } from 'lucide-react';
import Link from 'next/link';

// Mock data using the exact image
const MOCK_PLAN_DETAIL = {
    id: '1',
    name: 'Diagrama Cinta Transportadora 1',
    description: 'Esquema de puntos de lubricación de la cinta principal. Incluye motores y rodamientos clave.',
    imageUrl: '/reference-images/codificacion-equipos-foresa.jpeg',
    // In a real scenario, this would be fetched from the DB
    svgContent: null, // Placeholder for the vectorized version
    status: 'Vectorizado',
};

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [viewMode, setViewMode] = useState<'original' | 'vector'>('original');
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));


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
                            {MOCK_PLAN_DETAIL.name}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            ID: {resolvedParams.id} • {MOCK_PLAN_DETAIL.status}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setViewMode(viewMode === 'original' ? 'vector' : 'original')}>
                        {viewMode === 'original' ? (
                            <>
                                <PenTool className="mr-2 h-4 w-4" />
                                Ver Vector
                            </>
                        ) : (
                            <>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Original
                            </>
                        )}
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
                            {viewMode === 'original' ? 'Vista Raster (Original)' : 'Vista Vectorial (TikZ/SVG)'}
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
                        className="transition-transform duration-200 ease-out origin-center"
                        style={{ transform: `scale(${zoom})` }}
                    >
                        {viewMode === 'original' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={MOCK_PLAN_DETAIL.imageUrl}
                                alt="Original Plan"
                                className="max-w-full h-auto shadow-2xl rounded-sm"
                            />
                        ) : (
                            <div className="w-[800px] h-[600px] bg-white flex items-center justify-center shadow-2xl">
                                {MOCK_PLAN_DETAIL.svgContent ? (
                                    <div dangerouslySetInnerHTML={{ __html: MOCK_PLAN_DETAIL.svgContent }} />
                                ) : (
                                    <div className="text-center p-8">
                                        <PenTool className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-400">Versión vectorial no disponible aún.</p>
                                        <Button variant="link" className="mt-2 text-blue-500">
                                            Generar ahora
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>

            {/* Description / Metadata */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">Descripción Técnica</h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            {MOCK_PLAN_DETAIL.description}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">Componentes Detectados</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                <span>Motores</span>
                                <span className="font-mono font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 rounded">3</span>
                            </div>
                            <div className="flex items-center justify-between text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                <span>Puntos de Lubricación</span>
                                <span className="font-mono font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 rounded">12</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
