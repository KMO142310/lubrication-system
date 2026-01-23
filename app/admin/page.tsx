'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { Users, Shield, Database, RefreshCw, Check } from 'lucide-react';
import { dataService } from '@/lib/data';
import { User } from '@/lib/types';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => { setUsers(dataService.getUsers()); }, []);

  const handleReset = () => {
    dataService.resetData();
    setUsers(dataService.getUsers());
    setResetConfirm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-container">
          <nav className="breadcrumb">
            <Link href="/" className="breadcrumb-link">Dashboard</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Configuración</span>
          </nav>

          <header className="page-header">
            <h1 className="page-title">Configuración</h1>
            <p className="page-subtitle">Administración del sistema</p>
          </header>

          {/* Success Toast */}
          {showSuccess && (
            <div style={{
              position: 'fixed',
              top: 'var(--space-4)',
              right: 'var(--space-4)',
              background: 'var(--success-500)',
              color: 'white',
              padding: 'var(--space-4) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontWeight: 600,
              zIndex: 1000,
              boxShadow: 'var(--shadow-lg)',
              animation: 'slideIn 0.3s ease',
            }}>
              <Check style={{ width: 20, height: 20 }} />
              Datos restaurados correctamente
            </div>
          )}

          <div className="dashboard-grid">
            {/* Users Section */}
            <div className="col-span-8">
              <div className="card">
                <div className="card-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Users style={{ width: 20, height: 20, color: 'var(--accent-500)' }} />
                    <span className="card-title">Usuarios</span>
                  </span>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  {users.map(user => (
                    <div key={user.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-4) var(--space-6)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, var(--accent-400) 0%, var(--accent-600) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: 'var(--text-lg)',
                      }}>
                        {user.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, display: 'block' }}>{user.name}</span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{user.email}</span>
                      </div>
                      <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-primary'}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Shield style={{ width: 12, height: 12 }} />
                        {user.role === 'admin' ? 'Administrador' : 'Técnico'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="col-span-4">
              <div className="card">
                <div className="card-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Database style={{ width: 20, height: 20, color: 'var(--accent-500)' }} />
                    <span className="card-title">Sistema</span>
                  </span>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Versión</span>
                      <span style={{ fontWeight: 600 }}>1.0.0</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Base de Datos</span>
                      <span style={{ fontWeight: 600 }}>LocalStorage</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Entorno</span>
                      <span className="badge badge-success">Demo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Reset */}
            <div className="col-span-12">
              <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                <div className="card-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <RefreshCw style={{ width: 20, height: 20, color: 'var(--accent-500)' }} />
                    <span className="card-title">Datos de Demostración</span>
                  </span>
                </div>
                <div className="card-body">
                  <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                    Esta aplicación utiliza datos de demostración almacenados en tu navegador. Puedes restaurar los datos a su estado inicial en cualquier momento.
                  </p>
                  {!resetConfirm ? (
                    <button className="btn btn-primary" style={{ background: 'var(--accent-500)' }} onClick={() => setResetConfirm(true)}>
                      Restaurar Datos Iniciales
                    </button>
                  ) : (
                    <div style={{ background: 'var(--accent-100)', border: '1px solid var(--accent-200)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                      <p style={{ marginBottom: 'var(--space-3)', color: 'var(--accent-600)' }}>¿Estás seguro? Esto borrará todos los cambios realizados.</p>
                      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <button className="btn btn-secondary" onClick={() => setResetConfirm(false)}>Cancelar</button>
                        <button className="btn btn-primary" style={{ background: 'var(--accent-500)' }} onClick={handleReset}>Confirmar</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
