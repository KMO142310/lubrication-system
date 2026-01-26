'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function EvolutionCyclePage() {
  const [content, setContent] = useState<string>('Cargando...');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/roadmap/evolution', { cache: 'no-store' });
        if (!res.ok) {
          setContent('No se pudo cargar el roadmap.');
          return;
        }
        const text = await res.text();
        setContent(text);
      } catch {
        setContent('No se pudo cargar el roadmap.');
      }
    };

    load();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['desarrollador']}>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            <header className="page-header">
              <h1 className="page-title">/evolution-cycle</h1>
              <p className="page-subtitle">Planning + ejecución iterativa basada en ROADMAP_EVOLUTION.md</p>
            </header>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Roadmap</span>
              </div>
              <div className="card-body">
                <pre style={{
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.5,
                }}>
                  {content}
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
