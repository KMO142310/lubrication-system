'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
    Droplets,
    Eye,
    EyeOff,
    AlertCircle,
} from 'lucide-react';

type ViewMode = 'login' | 'register' | 'forgot' | 'biometric';

export default function LoginContainer() {
    const router = useRouter();
    const { login, loginWithGoogle } = useAuth();

    const [viewMode, setViewMode] = useState<ViewMode>('biometric'); // Default to modern auth
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Legacy handlers
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await login(email, password);
            if (result.success) {
                await new Promise(resolve => setTimeout(resolve, 100));
                router.push('/');
            } else {
                setError(result.error || 'Credenciales inválidas');
            }
        } catch {
            setError('Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const result = await loginWithGoogle();
        if (!result.success) {
            setError(result.error || 'Error con Google');
            setIsLoading(false);
        }
        // Redirect handled by Supabase
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <div className="login-logo">
                        <Droplets style={{ width: 32, height: 32 }} />
                    </div>
                    <h1>AISA Lubricación</h1>
                    <p>Acceso Seguro Industrial</p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="login-error">
                        <AlertCircle style={{ width: 16, height: 16 }} />
                        <span>{error}</span>
                    </div>
                )}

                {/* MODERN AUTH - GMAIL PRIMARY */}
                {viewMode === 'biometric' && (
                    <div className="modern-auth-stack">
                        {/* Google Button - PRINCIPAL */}
                        <button
                            className="btn-google-primary"
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continuar con Google
                        </button>

                        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', margin: '16px 0' }}>
                            Solo cuentas @aisa.cl autorizadas
                        </p>

                        {/* TEST MODE BYPASS - Visible with ?test=1 in URL */}
                        {(typeof window !== 'undefined' && window.location.search.includes('test=1')) && (
                            <button
                                className="btn btn-secondary"
                                style={{ marginTop: '1rem', background: '#059669', color: 'white', fontWeight: 600 }}
                                onClick={() => {
                                    localStorage.setItem('aisa_auth_session', JSON.stringify({
                                        id: 'test-user-1',
                                        name: 'Omar Alexis (Modo Test)',
                                        email: 'omar@aisa.cl',
                                        role: 'lubricador'
                                    }));
                                    router.push('/');
                                }}
                            >
                                ✅ ENTRAR MODO TEST (Omar)
                            </button>
                        )}

                        {/* Link to legacy login if needed */}
                        <button
                            className="text-btn"
                            onClick={() => setViewMode('login')}
                            style={{ marginTop: 24 }}
                        >
                            ¿Problemas? Usar contraseña
                        </button>
                    </div>
                )}

                {/* LEGACY PASSWORD LOGIN */}
                {viewMode === 'login' && (
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Contraseña</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary login-btn">
                            {isLoading ? '...' : 'Iniciar Sesión'}
                        </button>

                        <button
                            type="button"
                            className="text-btn"
                            onClick={() => setViewMode('biometric')}
                        >
                            ← Volver a Biometría
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="login-footer">
                    <p>AISA Aserraderos © 2026</p>
                    <p style={{ fontSize: 10, marginTop: 4 }}>Zero-Touch Identity Enabled</p>
                </div>
            </div>

            <style jsx>{`
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--background);
                    padding: var(--space-4);
                }
                .login-card {
                    width: 100%;
                    max-width: 400px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-2xl);
                    padding: var(--space-8);
                    box-shadow: var(--shadow-xl);
                }
                .login-header {
                    text-align: center;
                    margin-bottom: var(--space-6);
                }
                .login-logo {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%);
                    border-radius: var(--radius-xl);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    margin: 0 auto var(--space-4);
                }
                .login-header h1 {
                    font-size: var(--text-xl);
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .login-error {
                    background: var(--accent-100);
                    color: var(--accent-600);
                    padding: var(--space-3);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--space-4);
                    font-size: var(--text-sm);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .form-group { margin-bottom: var(--space-4); }
                .form-label { display: block; font-size: var(--text-xs); font-weight: 600; margin-bottom: var(--space-1); }
                .form-input { 
                    width: 100%; 
                    padding: var(--space-3); 
                    border: 1px solid var(--border); 
                    border-radius: var(--radius-md);
                    font-size: var(--text-sm);
                }
                .btn {
                    width: 100%;
                    padding: var(--space-3);
                    border-radius: var(--radius-md);
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-primary {
                    background: var(--primary-600);
                    color: white;
                }
                .btn-google {
                    width: 100%;
                    padding: var(--space-3);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    background: white;
                    color: var(--text-primary);
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    margin-bottom: var(--space-4);
                }
                .btn-google-primary {
                    width: 100%;
                    padding: var(--space-4);
                    border: 2px solid #4285F4;
                    border-radius: var(--radius-lg);
                    background: white;
                    color: #1a1a1a;
                    font-weight: 600;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-google-primary:hover {
                    background: #4285F4;
                    color: white;
                }
                .text-btn {
                    width: 100%;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: var(--text-sm);
                    cursor: pointer;
                    margin-top: var(--space-4);
                }
                .text-btn:hover { text-decoration: underline; color: var(--primary-600); }
                .divider {
                    display: flex;
                    align-items: center;
                    margin: var(--space-6) 0;
                }
                .divider::before, .divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: var(--border);
                }
                .divider span {
                    padding: 0 var(--space-2);
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }
                .password-input-wrapper { position: relative; }
                .password-toggle {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-muted);
                }
                .login-footer {
                    text-align: center;
                    margin-top: var(--space-6);
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }
            `}</style>
        </div>
    );
}
