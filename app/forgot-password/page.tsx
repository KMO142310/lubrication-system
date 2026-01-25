'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { forgotPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await forgotPassword(email);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Error al enviar email');
        }

        setIsLoading(false);
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1>Email Enviado</h1>
                        <p>Revisa tu bandeja de entrada para restablecer tu contraseña</p>
                    </div>
                    <Link href="/login" className="auth-button primary">
                        Volver a Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h1>Recuperar Contraseña</h1>
                    <p>Ingresa tu email para recibir instrucciones</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button
                        type="submit"
                        className="auth-button primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p><Link href="/login">Volver a Iniciar Sesión</Link></p>
                </div>
            </div>
        </div>
    );
}
