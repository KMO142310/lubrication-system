'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import {
    Factory,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Search,
    Settings,
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { Machine, Area } from '@/lib/types';

export default function EquiposPage() {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArea, setSelectedArea] = useState<string>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        areaId: '',
        make: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setMachines(dataService.getMachines());
        setAreas(dataService.getAreas());
    };

    const filteredMachines = machines.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesArea = selectedArea === 'all' || m.areaId === selectedArea;
        return matchesSearch && matchesArea;
    });

    const openCreateModal = () => {
        setEditingMachine(null);
        setFormData({ name: '', areaId: areas[0]?.id || '', make: '' });
        setShowModal(true);
    };

    const openEditModal = (machine: Machine) => {
        setEditingMachine(machine);
        setFormData({
            name: machine.name,
            areaId: machine.areaId,
            make: machine.make || '',
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.areaId) return;

        if (editingMachine) {
            // Actualizar máquina existente
            const updated = {
                ...editingMachine,
                name: formData.name,
                areaId: formData.areaId,
                make: formData.make,
            };
            const allMachines = dataService.getMachines();
            const index = allMachines.findIndex(m => m.id === editingMachine.id);
            if (index !== -1) {
                allMachines[index] = updated;
                localStorage.setItem('aisa_machines', JSON.stringify(allMachines));
            }
        } else {
            // Crear nueva máquina
            const newMachine: Machine = {
                id: `eq-${Date.now()}`,
                name: formData.name,
                areaId: formData.areaId,
                make: formData.make,
                createdAt: new Date().toISOString(),
            };
            const allMachines = dataService.getMachines();
            allMachines.push(newMachine);
            localStorage.setItem('aisa_machines', JSON.stringify(allMachines));
        }

        setShowModal(false);
        loadData();
    };

    const handleDelete = (machine: Machine) => {
        if (!confirm(`¿Eliminar "${machine.name}"? Esta acción no se puede deshacer.`)) return;

        const allMachines = dataService.getMachines().filter(m => m.id !== machine.id);
        localStorage.setItem('aisa_machines', JSON.stringify(allMachines));
        loadData();
    };

    const getAreaName = (areaId: string) => {
        const area = areas.find(a => a.id === areaId);
        return area?.name || 'Sin área';
    };

    return (
        <ProtectedRoute allowedRoles={['desarrollador', 'supervisor']}>
            <div className="app-layout">
                <Sidebar />

                <main className="main-content">
                    <div className="page-container">
                        <nav className="breadcrumb">
                            <Link href="/" className="breadcrumb-link">Dashboard</Link>
                            <span className="breadcrumb-separator">/</span>
                            <Link href="/admin" className="breadcrumb-link">Admin</Link>
                            <span className="breadcrumb-separator">/</span>
                            <span className="breadcrumb-current">Equipos</span>
                        </nav>

                        <header className="page-header">
                            <div className="page-header-top">
                                <div>
                                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Factory style={{ width: 28, height: 28, color: 'var(--accent-500)' }} />
                                        Gestión de Equipos
                                    </h1>
                                    <p className="page-subtitle">Administra las máquinas y equipos de la planta</p>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={openCreateModal}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <Plus style={{ width: 20, height: 20 }} />
                                    Agregar Equipo
                                </button>
                            </div>
                        </header>

                        {/* Filtros */}
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <div className="card-body" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <div className="input-group">
                                        <Search style={{ width: 18, height: 18, color: 'var(--text-muted)', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Buscar equipo..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ paddingLeft: '40px' }}
                                        />
                                    </div>
                                </div>
                                <select
                                    className="form-select"
                                    value={selectedArea}
                                    onChange={(e) => setSelectedArea(e.target.value)}
                                    style={{ minWidth: '200px' }}
                                >
                                    <option value="all">Todas las áreas</option>
                                    {areas.map(area => (
                                        <option key={area.id} value={area.id}>{area.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Lista de Equipos */}
                        <div className="card">
                            <div className="card-header">
                                <span className="card-title">Equipos Registrados</span>
                                <span className="badge badge-primary">{filteredMachines.length} equipos</span>
                            </div>
                            <div className="card-body" style={{ padding: 0 }}>
                                {filteredMachines.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                                        <Settings style={{ width: 48, height: 48, marginBottom: '12px', opacity: 0.5 }} />
                                        <p style={{ margin: 0, fontWeight: 600 }}>Sin equipos</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                                            {searchTerm ? 'No se encontraron resultados' : 'Agrega tu primer equipo'}
                                        </p>
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: 'var(--slate-50)', borderBottom: '2px solid var(--border)' }}>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '13px' }}>Equipo</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '13px' }}>Área</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '13px' }}>Fabricante</th>
                                                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '13px', width: '120px' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMachines.map(machine => (
                                                <tr key={machine.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div style={{ fontWeight: 600 }}>{machine.name}</div>
                                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {machine.id}</div>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span className="badge badge-secondary">{getAreaName(machine.areaId)}</span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                                                        {machine.make || '-'}
                                                    </td>
                                                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                            <button
                                                                onClick={() => openEditModal(machine)}
                                                                style={{
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid var(--border)',
                                                                    background: 'white',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <Edit2 style={{ width: 16, height: 16, color: 'var(--primary-600)' }} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(machine)}
                                                                style={{
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid var(--error-200)',
                                                                    background: 'var(--error-50)',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <Trash2 style={{ width: 16, height: 16, color: 'var(--error-600)' }} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Modal Crear/Editar */}
                        {showModal && (
                            <div
                                className="modal-overlay"
                                onClick={() => setShowModal(false)}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1000,
                                    padding: '16px',
                                }}
                            >
                                <div
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        maxWidth: '500px',
                                        width: '100%',
                                        maxHeight: '90vh',
                                        overflow: 'auto',
                                    }}
                                >
                                    <div style={{
                                        padding: '20px',
                                        borderBottom: '1px solid var(--border)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <h3 style={{ margin: 0, fontSize: '18px' }}>
                                            {editingMachine ? 'Editar Equipo' : 'Nuevo Equipo'}
                                        </h3>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                        >
                                            <X style={{ width: 20, height: 20 }} />
                                        </button>
                                    </div>

                                    <div style={{ padding: '20px' }}>
                                        <div className="form-group" style={{ marginBottom: '16px' }}>
                                            <label className="form-label">Nombre del Equipo *</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Ej: Descortezador Línea Gruesa"
                                            />
                                        </div>

                                        <div className="form-group" style={{ marginBottom: '16px' }}>
                                            <label className="form-label">Área *</label>
                                            <select
                                                className="form-select"
                                                value={formData.areaId}
                                                onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                                            >
                                                <option value="">Seleccionar área...</option>
                                                {areas.map(area => (
                                                    <option key={area.id} value={area.id}>{area.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group" style={{ marginBottom: '24px' }}>
                                            <label className="form-label">Fabricante</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={formData.make}
                                                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                                placeholder="Ej: LINCK, ESTERER, etc."
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => setShowModal(false)}
                                                style={{ flex: 1 }}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleSave}
                                                disabled={!formData.name || !formData.areaId}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                            >
                                                <Save style={{ width: 18, height: 18 }} />
                                                {editingMachine ? 'Guardar Cambios' : 'Crear Equipo'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
