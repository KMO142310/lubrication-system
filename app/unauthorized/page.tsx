'use client';

import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function UnauthorizedPage() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <header className="page-header">
            <h1 className="page-title">Acceso no autorizado</h1>
            <p className="page-subtitle">No tienes permisos para ver esta sección.</p>
          </header>

          <div className="card">
            <div className="card-body">
              <Link href="/" className="btn btn-primary">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
