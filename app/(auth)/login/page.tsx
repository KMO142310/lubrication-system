'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Credenciales inválidas');
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (userData?.role === 'admin' || userData?.role === 'supervisor') {
          router.push('/(supervisor)/dashboard');
        } else if (userData?.role === 'lubricator') {
          router.push('/(lubricator)/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch {
      setError('Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F1419' }}>
      <div className="w-full max-w-md px-6">
        <div className="rounded-sm p-8" style={{ backgroundColor: '#2D3748' }}>
          <h1 className="text-4xl font-bold text-center mb-2" style={{ color: '#D4740E' }}>
            BITACORA
          </h1>
          <p className="text-center mb-8" style={{ color: '#A0AEC0' }}>
            Sistema de Control de Lubricación Industrial
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm border-b-2 focus:outline-none focus:border-machinery transition-colors"
                style={{
                  backgroundColor: 'rgba(15, 20, 25, 0.5)',
                  borderColor: '#2D3748',
                  color: '#fff',
                }}
                placeholder="usuario@empresa.cl"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-white">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm border-b-2 focus:outline-none focus:border-machinery transition-colors"
                style={{
                  backgroundColor: 'rgba(15, 20, 25, 0.5)',
                  borderColor: '#2D3748',
                  color: '#fff',
                }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-sm text-sm" style={{ backgroundColor: 'rgba(229, 62, 62, 0.1)', color: '#E53E3E' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 rounded-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 text-lg"
              style={{ backgroundColor: '#D4740E', height: '56px' }}
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
