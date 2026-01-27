'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logError, AppError } from '@/lib/error-handler';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    userMessage?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Captura errores de renderizado en sus componentes hijos.
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Loguear usando nuestro sistema centralizado
        // Envolvemos en AppError si no lo es, o lo pasamos directo
        logError(error);
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-6 rounded-lg border border-red-200 bg-red-50 flex flex-col items-center justify-center text-center min-h-[200px]">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-red-900 mb-2">
                        Algo salió mal
                    </h3>
                    <p className="text-sm text-red-700 max-w-md mb-4">
                        {this.props.userMessage || 'Ha ocurrido un error inesperado al mostrar este componente.'}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 rounded-md text-red-700 hover:bg-red-50 font-medium text-sm transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Intentar nuevamente
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

