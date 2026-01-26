'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Factory, Upload, CheckCircle2, UserCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import ExcelImporter from '@/components/ExcelImporter';
import { cn } from '@/lib/utils';
// import { toast } from 'react-hot-toast'; // Assuming it's installed, otherwise will comment out or adapt

// Step Definitions
const STEPS = [
    { number: 1, title: 'Organización', icon: Building2 },
    { number: 2, title: 'Primera Planta', icon: Factory },
    { number: 3, title: 'Activos', icon: Upload },
    { number: 4, title: 'Admin', icon: UserCheck },
    { number: 5, title: 'Finalizar', icon: CheckCircle2 },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        orgName: '',
        orgSlug: '',
        plantName: '',
        plantLocation: '',
        adminName: '',
        adminEmail: '',
        assets: [] as any[], // Imported from excel
    });

    const updateForm = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        // Auto-generate slug from org name if empty
        if (key === 'orgName' && !formData.orgSlug) {
            setFormData(prev => ({
                ...prev,
                orgSlug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            }));
        }
    };

    const handleNext = async () => {
        if (currentStep === 5) {
            // Final Submission
            await submitOnboarding();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    const submitOnboarding = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/onboarding/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Error al crear la organización');

            // Success
            // toast.success('¡Organización creada exitosamente!');
            router.push('/login?onboarding=success');
        } catch (error) {
            console.error(error);
            // toast.error('Ocurrió un error. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display text-[var(--text-highlight)] mb-2">
                        Configuración Inicial
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Bienvenido a AISA. Configuremos su entorno de trabajo industrial.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between items-center relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--metal-700)] -z-10 rounded"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-[var(--led-info)] -z-10 transition-all duration-300 rounded"
                            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                        ></div>

                        {STEPS.map((step) => {
                            const isActive = step.number <= currentStep;
                            const isCurrent = step.number === currentStep;
                            return (
                                <div key={step.number} className="flex flex-col items-center gap-2 bg-[var(--background)] px-2">
                                    <div className={cn(
                                        "w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300",
                                        isActive
                                            ? "bg-[var(--metal-800)] border-[var(--led-info)] text-[var(--led-info)] shadow-[0_0_15px_rgba(0,181,226,0.3)]"
                                            : "bg-[var(--metal-900)] border-[var(--metal-600)] text-[var(--metal-500)]"
                                    )}>
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <span className={cn(
                                        "text-xs font-bold uppercase tracking-wider transition-colors",
                                        isCurrent ? "text-[var(--text-highlight)]" : "text-[var(--text-muted)]"
                                    )}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-[var(--shadow-panel)] overflow-hidden">
                    <div className="bg-[var(--metal-800)] px-6 py-4 border-b border-[var(--metal-600)] flex justify-between items-center">
                        <h2 className="text-lg font-display text-[var(--text-primary)]">
                            Paso {currentStep}: {STEPS[currentStep - 1].title}
                        </h2>
                        <div className="text-xs font-mono text-[var(--led-info)] bg-[var(--led-info)]/10 px-2 py-1 rounded">
                            SETUP_MODE: ACTIVE
                        </div>
                    </div>

                    <div className="p-8 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                {/* STEP 1: ORGANIZATION */}
                                {currentStep === 1 && (
                                    <div className="space-y-6 max-w-lg mx-auto">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                                Nombre de la Empresa / Organización
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.orgName}
                                                onChange={(e) => updateForm('orgName', e.target.value)}
                                                className="w-full bg-[var(--metal-900)] border border-[var(--metal-600)] rounded p-3 text-[var(--text-primary)] focus:border-[var(--led-info)] focus:ring-1 focus:ring-[var(--led-info)] outline-none transition-all"
                                                placeholder="Ej. Minera Centinela"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                                Identificador Único (Slug)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.orgSlug}
                                                onChange={(e) => updateForm('orgSlug', e.target.value)}
                                                className="w-full bg-[var(--metal-900)] border border-[var(--metal-600)] rounded p-3 text-[var(--font-mono)] text-[var(--led-info)] focus:border-[var(--led-info)] outline-none"
                                                placeholder="minera-centinela"
                                            />
                                            <p className="text-xs text-[var(--text-muted)] mt-1">Este identificador se usará en la URL de su espacio de trabajo.</p>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 2: FIRST PLANT */}
                                {currentStep === 2 && (
                                    <div className="space-y-6 max-w-lg mx-auto">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                                Nombre de la Planta Principal
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.plantName}
                                                onChange={(e) => updateForm('plantName', e.target.value)}
                                                className="w-full bg-[var(--metal-900)] border border-[var(--metal-600)] rounded p-3 text-[var(--text-primary)] focus:border-[var(--led-info)] outline-none"
                                                placeholder="Ej. Planta Concentradora"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                                Ubicación / Área Geográfica
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.plantLocation}
                                                onChange={(e) => updateForm('plantLocation', e.target.value)}
                                                className="w-full bg-[var(--metal-900)] border border-[var(--metal-600)] rounded p-3 text-[var(--text-primary)] focus:border-[var(--led-info)] outline-none"
                                                placeholder="Ej. Antofagasta, Chile"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: ASSETS */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div className="text-center mb-6">
                                            <h3 className="text-lg font-semibold text-[var(--text-highlight)]">Importación Masiva de Activos</h3>
                                            <p className="text-sm text-[var(--text-secondary)]">Puede cargar su inventario inicial ahora o hacerlo más tarde.</p>
                                        </div>

                                        <ExcelImporter
                                            onImport={(data) => updateForm('assets', data)}
                                            templateUrl="/templates/import_template.xlsx"
                                        />

                                        <div className="text-center mt-4">
                                            <p className="text-xs text-[var(--text-muted)]">
                                                {formData.assets.length > 0
                                                    ? `${formData.assets.length} registros cargados listos para importar.`
                                                    : "Si omite este paso, el sistema iniciará con datos vacíos."}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: ADMIN */}
                                {currentStep === 4 && (
                                    <div className="space-y-6 max-w-lg mx-auto">
                                        <div className="bg-[var(--led-info)]/10 border border-[var(--led-info)]/20 p-4 rounded mb-6">
                                            <p className="text-sm text-[var(--led-info)] flex items-center gap-2">
                                                <UserCheck className="w-4 h-4" />
                                                Se creará una cuenta de Administrador Principal para esta organización.
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                                Nombre Completo del Administrador
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.adminName}
                                                onChange={(e) => updateForm('adminName', e.target.value)}
                                                className="w-full bg-[var(--metal-900)] border border-[var(--metal-600)] rounded p-3 text-[var(--text-primary)] focus:border-[var(--led-info)] outline-none"
                                                placeholder="Ej. Juan Pérez"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                                                Correo Electrónico Corporativo
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.adminEmail}
                                                onChange={(e) => updateForm('adminEmail', e.target.value)}
                                                className="w-full bg-[var(--metal-900)] border border-[var(--metal-600)] rounded p-3 text-[var(--text-primary)] focus:border-[var(--led-info)] outline-none"
                                                placeholder="juan.perez@empresa.com"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 5: FINISH */}
                                {currentStep === 5 && (
                                    <div className="flex flex-col items-center justify-center text-center h-full space-y-6">
                                        <div className="w-20 h-20 rounded-full bg-[var(--led-on)]/10 flex items-center justify-center text-[var(--led-on)] mb-4 shadow-[0_0_30px_rgba(0,255,65,0.2)]">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <h2 className="text-2xl font-display text-[var(--text-highlight)]">¡Todo Listo!</h2>
                                        <div className="space-y-2 text-[var(--text-secondary)] max-w-md">
                                            <p>Estamos listos para crear su entorno <strong>{formData.orgName}</strong>.</p>
                                            <ul className="text-sm text-left bg-[var(--metal-900)] p-4 rounded border border-[var(--metal-600)] space-y-2 mt-4">
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--ansi-green)]" /> Organización: {formData.orgName}</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--ansi-green)]" /> Planta: {formData.plantName}</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--ansi-green)]" /> Administrador: {formData.adminName}</li>
                                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--ansi-green)]" /> Activos a importar: {formData.assets.length}</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer / Controls */}
                    <div className="bg-[var(--metal-800)] px-6 py-4 border-t border-[var(--metal-600)] flex justify-between">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1 || isLoading}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors",
                                currentStep === 1
                                    ? "text-[var(--metal-600)] cursor-not-allowed"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--metal-700)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Atrás
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={isLoading}
                            className={cn(
                                "flex items-center gap-2 px-8 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all shadow-lg",
                                currentStep === 5
                                    ? "bg-[var(--led-on)] text-[var(--metal-900)] hover:brightness-110 shadow-[var(--shadow-led-green)]" // Final button green
                                    : "bg-[var(--ansi-blue)] text-white hover:bg-[#0044D6]", // Next button blue
                                isLoading && "opacity-50 cursor-wait"
                            )}
                        >
                            {isLoading ? 'Procesando...' : currentStep === 5 ? 'Finalizar Configuración' : 'Siguiente'}
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
