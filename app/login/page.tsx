'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { signUpWithEmail, resetPassword } from '@/lib/supabase';
import { Droplets, Eye, EyeOff, AlertCircle, CheckCircle, Mail, ArrowLeft } from 'lucide-react';

type ViewMode = 'login' | 'register' | 'forgot';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [viewMode, setViewMode] = useState<ViewMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setError('');
        setSuccess('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Usar auth local (usuarios hardcodeados) - funciona offline
            const result = await login(email, password);

            if (result.success) {
                // Pequeño delay para asegurar que el estado se guarde
                await new Promise(resolve => setTimeout(resolve, 100));
                router.push('/');
                return;
            }

            setError(result.error || 'Credenciales inválidas');
        } catch (_err) {
            setError('Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        const { data, error } = await signUpWithEmail(email, password, name);

        if (error) {
            setError(error.message);
        } else if (data?.user) {
            setSuccess('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.');
            setTimeout(() => {
                setViewMode('login');
                resetForm();
            }, 3000);
        }

        setIsLoading(false);
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        const { error } = await resetPassword(email);

        if (error) {
            setError(error.message);
        } else {
            setSuccess('Te enviamos un correo con instrucciones para restablecer tu contraseña.');
        }

        setIsLoading(false);
    };



    return (
        <div className="login-container">
            <div className="login-card">
                {/* Logo */}
                <div className="login-header">
                    <div className="login-logo">
                        <Droplets style={{ width: 32, height: 32 }} />
                    </div>
                    <h1>AISA Lubricación</h1>
                    <p>{viewMode === 'login' ? 'Iniciar Sesión' : viewMode === 'register' ? 'Crear Cuenta' : 'Recuperar Contraseña'}</p>
                </div>

                {/* Back button for register/forgot */}
                {viewMode !== 'login' && (
                    <button
                        className="back-btn"
                        onClick={() => { setViewMode('login'); resetForm(); }}
                    >
                        <ArrowLeft style={{ width: 16, height: 16 }} />
                        Volver al login
                    </button>
                )}

                {/* Error */}
                {error && (
                    <div className="login-error">
                        <AlertCircle style={{ width: 16, height: 16 }} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="login-success">
                        <CheckCircle style={{ width: 16, height: 16 }} />
                        <span>{success}</span>
                    </div>
                )}

                {/* LOGIN FORM */}
                {viewMode === 'login' && (
                    <>
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
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
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
                                        autoComplete="off"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="forgot-link"
                                onClick={() => { setViewMode('forgot'); resetForm(); }}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary login-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="loading-spinner" style={{ width: 20, height: 20 }} />
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </form>

                        <div className="register-link">
                            ¿No tienes cuenta?{' '}
                            <button onClick={() => { setViewMode('register'); resetForm(); }}>
                                Crear cuenta
                            </button>
                        </div>
                    </>
                )}

                {/* REGISTER FORM */}
                {viewMode === 'register' && (
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label className="form-label">Nombre Completo</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Tu nombre"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>

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
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirmar Contraseña</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Repite tu contraseña"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner" style={{ width: 20, height: 20 }} />
                            ) : (
                                'Crear Cuenta'
                            )}
                        </button>
                    </form>
                )}

                {/* FORGOT PASSWORD FORM */}
                {viewMode === 'forgot' && (
                    <form onSubmit={handleForgotPassword}>
                        <div className="forgot-info">
                            <Mail style={{ width: 48, height: 48, color: 'var(--primary-600)', margin: '0 auto 16px' }} />
                            <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
                        </div>

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

                        <button
                            type="submit"
                            className="btn btn-primary login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner" style={{ width: 20, height: 20 }} />
                            ) : (
                                'Enviar Enlace'
                            )}
                        </button>
                    </form>
                )}

                {/* Footer info */}
                <div className="login-footer">
                    <p>Sistema de Gestión de Lubricación Industrial</p>
                    <p>AISA Aserraderos © 2026</p>
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
          max-width: 420px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-xl);
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--space-8);
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
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .login-header p {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--accent-100);
          color: var(--accent-600);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-4);
          font-size: var(--text-sm);
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-input-wrapper .form-input {
          padding-right: 48px;
        }

        .password-toggle {
          position: absolute;
          right: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: var(--space-1);
        }

        .password-toggle:hover {
          color: var(--text-primary);
        }

        .login-btn {
          width: 100%;
          margin-top: var(--space-4);
          padding: var(--space-4);
        }

        .login-footer {
          margin-top: var(--space-6);
          padding-top: var(--space-6);
          border-top: 1px solid var(--border);
          text-align: center;
        }

        .login-footer p {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin: 0;
        }

        .login-footer p:first-child {
          font-weight: 600;
          margin-bottom: var(--space-1);
        }

        .login-success {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-4);
          font-size: var(--text-sm);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: var(--text-sm);
          cursor: pointer;
          padding: 0;
          margin-bottom: var(--space-4);
        }

        .back-btn:hover {
          color: var(--text-primary);
        }

        .forgot-link {
          display: block;
          width: 100%;
          text-align: right;
          background: none;
          border: none;
          color: var(--primary-600);
          font-size: var(--text-sm);
          cursor: pointer;
          padding: 0;
          margin-top: var(--space-2);
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: var(--space-6) 0;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .divider span {
          padding: 0 var(--space-4);
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-google:hover {
          background: var(--slate-50);
          border-color: var(--slate-300);
        }

        .register-link {
          text-align: center;
          margin-top: var(--space-6);
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .register-link button {
          background: none;
          border: none;
          color: var(--primary-600);
          font-weight: 600;
          cursor: pointer;
        }

        .register-link button:hover {
          text-decoration: underline;
        }

        .forgot-info {
          text-align: center;
          margin-bottom: var(--space-6);
        }

        .forgot-info p {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: 1.5;
        }
      `}</style>
        </div>
    );
}
