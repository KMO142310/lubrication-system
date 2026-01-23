'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Users, Shield, Plus, X, Check, Pencil, Trash2 } from 'lucide-react';
import { dataService } from '@/lib/data';
import { User } from '@/lib/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'tecnico' as 'admin' | 'supervisor' | 'tecnico',
  });

  const loadUsers = () => {
    setUsers(dataService.getUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Actualizar usuario existente
      const updatedUsers = users.map(u => 
        u.id === editingUser.id 
          ? { ...u, name: formData.name, email: formData.email, role: formData.role }
          : u
      );
      localStorage.setItem('aisa_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setEditingUser(null);
    } else {
      // Crear nuevo usuario
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...users, newUser];
      localStorage.setItem('aisa_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
    
    setShowForm(false);
    setFormData({ name: '', email: '', role: 'tecnico' });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowForm(true);
  };

  const handleDelete = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('aisa_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setShowDeleteConfirm(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
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
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleEdit(user)}
                              title="Editar usuario"
                            >
                              <Pencil style={{ width: 14, height: 14 }} />
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                              onClick={() => setShowDeleteConfirm(user.id)}
                              title="Eliminar usuario"
                            >
                              <Trash2 style={{ width: 14, height: 14 }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* User Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={handleCloseForm}>
            <div className="modal" style={{ maxWidth: 450 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <button className="modal-close" onClick={handleCloseForm}>
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
                  <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Check style={{ width: 16, height: 16 }} />
                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
            <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Confirmar Eliminación</h2>
                <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--text-secondary)' }}>
                  ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                  Cancelar
                </button>
                <button 
                  className="btn" 
                  style={{ background: '#ef4444', color: 'white' }}
                  onClick={() => handleDelete(showDeleteConfirm)}
                >
                  <Trash2 style={{ width: 16, height: 16 }} />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
