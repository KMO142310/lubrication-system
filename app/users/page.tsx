'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Users, Shield, Mail, Plus, X, Check, Pencil } from 'lucide-react';
import { dataService } from '@/lib/data';
import { User } from '@/lib/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'tecnico' as 'admin' | 'supervisor' | 'tecnico',
  });

  useEffect(() => {
    setUsers(dataService.getUsers());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would save to Supabase
    setShowForm(false);
    setFormData({ name: '', email: '', role: 'tecnico' });
  };

  const getRoleBadge = (role: string) => {
    const config: Record<string, { class: string; label: string }> = {
      admin: { class: 'badge-danger', label: 'Administrador' },
      supervisor: { class: 'badge-warning', label: 'Supervisor' },
      tecnico: { class: 'badge-primary', label: 'Técnico' },
    };
    const { class: cls, label } = config[role] || config.tecnico;
    return (
      <span className={`badge ${cls}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Shield style={{ width: 12, height: 12 }} />
        {label}
      </span>
    );
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            <nav className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Dashboard</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Usuarios</span>
            </nav>

            <header className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title">Gestión de Usuarios</h1>
                  <p className="page-subtitle">
                    Administración de accesos y roles del sistema
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                  <Plus style={{ width: 16, height: 16 }} />
                  Nuevo Usuario
                </button>
              </div>
            </header>

            {/* Stats */}
            <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
              <div className="col-span-4">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon primary">
                      <Users style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <div>
                    <span className="stat-value">{users.length}</span>
                    <span className="stat-label">Usuarios Totales</span>
                  </div>
                </div>
              </div>
              <div className="col-span-4">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon success">
                      <Shield style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <div>
                    <span className="stat-value">{users.filter(u => u.role === 'admin').length}</span>
                    <span className="stat-label">Administradores</span>
                  </div>
                </div>
              </div>
              <div className="col-span-4">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon accent">
                      <Users style={{ width: 24, height: 24 }} />
                    </div>
                  </div>
                  <div>
                    <span className="stat-value">{users.filter(u => u.role === 'tecnico').length}</span>
                    <span className="stat-label">Técnicos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Listado de Usuarios</span>
              </div>
              <div className="data-table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Fecha Registro</th>
                      <th style={{ width: 100 }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#0f172a',
                              fontWeight: 700,
                              fontSize: '16px',
                            }}>
                              {user.name.charAt(0)}
                            </div>
                            <span style={{ fontWeight: 600 }}>{user.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{user.email}</td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                          {new Date(user.createdAt).toLocaleDateString('es-CL')}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingUser(user)}
                            title="Editar usuario"
                          >
                            <Pencil style={{ width: 14, height: 14 }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* New User Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" style={{ maxWidth: 450 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Nuevo Usuario</h2>
                <button className="modal-close" onClick={() => setShowForm(false)}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Nombre Completo *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-input"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="usuario@aisa.cl"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rol *</label>
                      <select
                        className="form-input"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value as typeof formData.role })}
                        required
                      >
                        <option value="tecnico">Técnico</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Check style={{ width: 16, height: 16 }} />
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
