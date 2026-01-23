'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Droplets, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading: authLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.error || 'Error al iniciar sesión');
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
                    <p>Sistema de Gestión Industrial</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="login-error">
                        <AlertCircle style={{ width: 16, height: 16 }} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
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
                                autoComplete="current-password"
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
                        type="submit"
                        className="btn btn-primary login-btn"
                        disabled={isLoading || authLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner" style={{ width: 20, height: 20 }} />
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                {/* Demo credentials */}
                <div className="demo-credentials">
                    <p className="demo-title">Credenciales de Demo:</p>
                    <div className="demo-users">
                        <div className="demo-user">
                            <span className="badge badge-danger">Admin</span>
                            <code>omar@aisa.cl / admin123</code>
                        </div>
                        <div className="demo-user">
                            <span className="badge badge-warning">Supervisor</span>
                            <code>supervisor@aisa.cl / super123</code>
                        </div>
                        <div className="demo-user">
                            <span className="badge badge-primary">Técnico</span>
                            <code>juan@lubricacion.cl / tech123</code>
                        </div>
                    </div>
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

        .demo-credentials {
          margin-top: var(--space-6);
          padding-top: var(--space-6);
          border-top: 1px solid var(--border);
        }

        .demo-title {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--space-3);
        }

        .demo-users {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .demo-user {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--text-sm);
        }

        .demo-user code {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
