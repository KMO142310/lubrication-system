'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import {
  Plus,
  Building2,
  MapPin,
  Cog,
  Box,
  Droplets,
  Save,
  X,
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { Plant, Area, Machine, Component, LubricationPoint, Lubricant, Frequency } from '@/lib/types';

type FormMode = 'plant' | 'area' | 'machine' | 'component' | 'point' | 'lubricant' | null;

export default function AssetsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [points, setPoints] = useState<LubricationPoint[]>([]);
  const [lubricants, setLubricants] = useState<Lubricant[]>([]);
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);

  const [formMode, setFormMode] = useState<FormMode>(null);
  const [selectedParentId, setSelectedParentId] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    description: '',
    code: '',
    lubricantId: '',
    frequencyId: '',
    method: 'manual',
    quantity: 0,
    type: 'aceite',
    viscosity: '',
    nlgiGrade: '',
  });

  const loadData = useCallback(() => {
    setPlants(dataService.getPlants());
    setAreas(dataService.getAreas());
    setMachines(dataService.getMachines());
    setComponents(dataService.getComponents());
    setPoints(dataService.getLubricationPoints());
    setLubricants(dataService.getLubricants());
    setFrequencies(dataService.getFrequencies());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const resetForm = () => {
    setFormMode(null);
    setSelectedParentId('');
    setFormData({
      name: '', make: '', model: '', description: '', code: '',
      lubricantId: '', frequencyId: '', method: 'manual', quantity: 0,
      type: 'aceite', viscosity: '', nlgiGrade: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    switch (formMode) {
      case 'plant':
        dataService.addPlant({ name: formData.name });
        break;
      case 'area':
        dataService.addArea({ name: formData.name, plantId: selectedParentId });
        break;
      case 'machine':
        dataService.addMachine({
          name: formData.name,
          areaId: selectedParentId,
          make: formData.make || undefined,
          model: formData.model || undefined,
        });
        break;
      case 'component':
        dataService.addComponent({ name: formData.name, machineId: selectedParentId });
        break;
      case 'point':
        dataService.addLubricationPoint({
          componentId: selectedParentId,
          code: formData.code,
          description: formData.description,
          lubricantId: formData.lubricantId,
          frequencyId: formData.frequencyId,
          method: formData.method as 'manual' | 'centralizado' | 'automatico',
          quantity: formData.quantity,
        });
        break;
      case 'lubricant':
        dataService.addLubricant({
          name: formData.name,
          type: formData.type as 'aceite' | 'grasa',
          viscosity: formData.type === 'aceite' ? formData.viscosity : undefined,
          nlgiGrade: formData.type === 'grasa' ? formData.nlgiGrade : undefined,
        });
        break;
    }

    resetForm();
    loadData();
  };

  const openForm = (mode: FormMode, parentId?: string) => {
    setFormMode(mode);
    setSelectedParentId(parentId || '');
  };

  const counts = dataService.getCounts();

  return (
    <ProtectedRoute allowedRoles={['desarrollador', 'supervisor']}>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            {/* Header */}
            <nav className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Dashboard</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Configuración de Activos</span>
            </nav>

            <header className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title">Configuración de Activos</h1>
                  <p className="page-subtitle">Registre plantas, máquinas, lubricantes y puntos de lubricación</p>
                </div>
              </div>
            </header>

            {/* Summary Cards */}
            <div className="dashboard-grid" style={{ marginBottom: 'var(--space-8)' }}>
              <div className="col-span-3">
                <div className="stat-card" onClick={() => openForm('plant')} style={{ cursor: 'pointer' }}>
                  <div className="stat-icon primary"><Building2 style={{ width: 24, height: 24 }} /></div>
                  <span className="stat-value">{counts.plants}</span>
                  <span className="stat-label">Plantas</span>
                </div>
              </div>
              <div className="col-span-3">
                <div className="stat-card">
                  <div className="stat-icon warning"><Cog style={{ width: 24, height: 24 }} /></div>
                  <span className="stat-value">{counts.machines}</span>
                  <span className="stat-label">Máquinas</span>
                </div>
              </div>
              <div className="col-span-3">
                <div className="stat-card" onClick={() => openForm('lubricant')} style={{ cursor: 'pointer' }}>
                  <div className="stat-icon accent"><Droplets style={{ width: 24, height: 24 }} /></div>
                  <span className="stat-value">{counts.lubricants}</span>
                  <span className="stat-label">Lubricantes</span>
                </div>
              </div>
              <div className="col-span-3">
                <div className="stat-card">
                  <div className="stat-icon success"><Box style={{ width: 24, height: 24 }} /></div>
                  <span className="stat-value">{counts.lubricationPoints}</span>
                  <span className="stat-label">Puntos</span>
                </div>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="card-header">
                <span className="card-title">Agregar Nuevo</span>
              </div>
              <div className="card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <button className="btn btn-primary" onClick={() => openForm('plant')}>
                  <Building2 style={{ width: 16, height: 16 }} /> Planta
                </button>
                <button className="btn btn-secondary" onClick={() => openForm('lubricant')}>
                  <Droplets style={{ width: 16, height: 16 }} /> Lubricante
                </button>
                {plants.length > 0 && (
                  <button className="btn btn-secondary" onClick={() => openForm('area', plants[0].id)}>
                    <MapPin style={{ width: 16, height: 16 }} /> Área
                  </button>
                )}
                {areas.length > 0 && (
                  <button className="btn btn-secondary" onClick={() => openForm('machine', areas[0].id)}>
                    <Cog style={{ width: 16, height: 16 }} /> Máquina
                  </button>
                )}
                {machines.length > 0 && (
                  <button className="btn btn-secondary" onClick={() => openForm('component', machines[0].id)}>
                    <Box style={{ width: 16, height: 16 }} /> Componente
                  </button>
                )}
                {components.length > 0 && lubricants.length > 0 && (
                  <button className="btn btn-secondary" onClick={() => openForm('point', components[0].id)}>
                    <Plus style={{ width: 16, height: 16 }} /> Punto Lubricación
                  </button>
                )}
              </div>
            </div>

            {/* Hierarchy View */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Jerarquía de Activos</span>
              </div>
              <div className="card-body" style={{ maxHeight: 500, overflowY: 'auto' }}>
                {plants.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                    <Building2 style={{ width: 48, height: 48, marginBottom: 'var(--space-4)', opacity: 0.3 }} />
                    <p>No hay activos registrados</p>
                    <p style={{ fontSize: 'var(--text-sm)' }}>Comience agregando una Planta</p>
                  </div>
                ) : (
                  <div className="hierarchy-list">
                    {plants.map(plant => (
                      <div key={plant.id} className="hierarchy-item plant">
                        <div className="hierarchy-header">
                          <Building2 style={{ width: 16, height: 16, color: 'var(--primary-600)' }} />
                          <span className="hierarchy-name">{plant.name}</span>
                          <button className="add-btn" onClick={() => openForm('area', plant.id)}>
                            <Plus style={{ width: 14, height: 14 }} /> Área
                          </button>
                        </div>
                        <div className="hierarchy-children">
                          {areas.filter(a => a.plantId === plant.id).map(area => (
                            <div key={area.id} className="hierarchy-item area">
                              <div className="hierarchy-header">
                                <MapPin style={{ width: 14, height: 14, color: '#8b5cf6' }} />
                                <span className="hierarchy-name">{area.name}</span>
                                <button className="add-btn" onClick={() => openForm('machine', area.id)}>
                                  <Plus style={{ width: 14, height: 14 }} /> Máquina
                                </button>
                              </div>
                              <div className="hierarchy-children">
                                {machines.filter(m => m.areaId === area.id).map(machine => (
                                  <div key={machine.id} className="hierarchy-item machine">
                                    <div className="hierarchy-header">
                                      <Cog style={{ width: 14, height: 14, color: 'var(--warning-500)' }} />
                                      <span className="hierarchy-name">{machine.name}</span>
                                      <span className="hierarchy-meta">{machine.make} {machine.model}</span>
                                      <button className="add-btn" onClick={() => openForm('component', machine.id)}>
                                        <Plus style={{ width: 14, height: 14 }} /> Comp.
                                      </button>
                                    </div>
                                    <div className="hierarchy-children">
                                      {components.filter(c => c.machineId === machine.id).map(comp => (
                                        <div key={comp.id} className="hierarchy-item component">
                                          <div className="hierarchy-header">
                                            <Box style={{ width: 14, height: 14, color: '#6366f1' }} />
                                            <span className="hierarchy-name">{comp.name}</span>
                                            <button className="add-btn" onClick={() => openForm('point', comp.id)}>
                                              <Plus style={{ width: 14, height: 14 }} /> Punto
                                            </button>
                                          </div>
                                          <div className="hierarchy-children">
                                            {points.filter(p => p.componentId === comp.id).map(point => {
                                              const lub = lubricants.find(l => l.id === point.lubricantId);
                                              const freq = frequencies.find(f => f.id === point.frequencyId);
                                              return (
                                                <div key={point.id} className="hierarchy-item point">
                                                  <div className="hierarchy-header">
                                                    <Droplets style={{ width: 14, height: 14, color: 'var(--accent-500)' }} />
                                                    <span className="hierarchy-code">{point.code}</span>
                                                    <span className="hierarchy-name">{point.description}</span>
                                                    <span className="hierarchy-meta">{lub?.name} • {freq?.name}</span>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lubricants Table */}
            {lubricants.length > 0 && (
              <div className="card" style={{ marginTop: 'var(--space-6)' }}>
                <div className="card-header">
                  <span className="card-title">Lubricantes Registrados</span>
                  <button className="btn btn-secondary btn-sm" onClick={() => openForm('lubricant')}>
                    <Plus style={{ width: 14, height: 14 }} /> Agregar
                  </button>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Especificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lubricants.map(lub => (
                      <tr key={lub.id}>
                        <td className="cell-primary">{lub.name}</td>
                        <td><span className={`badge ${lub.type === 'aceite' ? 'badge-primary' : 'badge-warning'}`}>{lub.type}</span></td>
                        <td>{lub.type === 'aceite' ? lub.viscosity : lub.nlgiGrade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Form Modal */}
      {formMode && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {formMode === 'plant' && 'Nueva Planta'}
                {formMode === 'area' && 'Nueva Área'}
                {formMode === 'machine' && 'Nueva Máquina'}
                {formMode === 'component' && 'Nuevo Componente'}
                {formMode === 'point' && 'Nuevo Punto de Lubricación'}
                {formMode === 'lubricant' && 'Nuevo Lubricante'}
              </h2>
              <button className="modal-close" onClick={resetForm}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {(formMode === 'plant' || formMode === 'area' || formMode === 'component') && (
                  <div className="form-group">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder={formMode === 'plant' ? 'Ej: Línea Principal' : formMode === 'area' ? 'Ej: Sierra Principal' : 'Ej: Caja Reductora'}
                      required
                    />
                  </div>
                )}

                {formMode === 'area' && (
                  <div className="form-group">
                    <label className="form-label">Planta *</label>
                    <select className="form-select" value={selectedParentId} onChange={e => setSelectedParentId(e.target.value)} required>
                      <option value="">Seleccionar...</option>
                      {plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                )}

                {formMode === 'machine' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Área *</label>
                      <select className="form-select" value={selectedParentId} onChange={e => setSelectedParentId(e.target.value)} required>
                        <option value="">Seleccionar...</option>
                        {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nombre Máquina *</label>
                      <input type="text" className="form-input" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Ej: Sierra Huincha Nº1" required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label">Marca</label>
                        <input type="text" className="form-input" value={formData.make} onChange={e => setFormData(p => ({ ...p, make: e.target.value }))} placeholder="Ej: LINCK" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Modelo</label>
                        <input type="text" className="form-input" value={formData.model} onChange={e => setFormData(p => ({ ...p, model: e.target.value }))} placeholder="Ej: T200" />
                      </div>
                    </div>
                  </>
                )}

                {formMode === 'component' && (
                  <div className="form-group">
                    <label className="form-label">Máquina *</label>
                    <select className="form-select" value={selectedParentId} onChange={e => setSelectedParentId(e.target.value)} required>
                      <option value="">Seleccionar...</option>
                      {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                )}

                {formMode === 'point' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Componente *</label>
                      <select className="form-select" value={selectedParentId} onChange={e => setSelectedParentId(e.target.value)} required>
                        <option value="">Seleccionar...</option>
                        {components.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Código *</label>
                      <input type="text" className="form-input" value={formData.code} onChange={e => setFormData(p => ({ ...p, code: e.target.value }))} placeholder="Ej: LG-SP-SH1-CR-01" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Descripción *</label>
                      <input type="text" className="form-input" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Ej: Aceite caja reductora - nivel y relleno" required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label">Lubricante *</label>
                        <select className="form-select" value={formData.lubricantId} onChange={e => setFormData(p => ({ ...p, lubricantId: e.target.value }))} required>
                          <option value="">Seleccionar...</option>
                          {lubricants.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Frecuencia *</label>
                        <select className="form-select" value={formData.frequencyId} onChange={e => setFormData(p => ({ ...p, frequencyId: e.target.value }))} required>
                          <option value="">Seleccionar...</option>
                          {frequencies.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                      <div className="form-group">
                        <label className="form-label">Método</label>
                        <select className="form-select" value={formData.method} onChange={e => setFormData(p => ({ ...p, method: e.target.value }))}>
                          <option value="manual">Manual</option>
                          <option value="centralizado">Centralizado</option>
                          <option value="automatico">Automático</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Cantidad (ml o g)</label>
                        <input type="number" className="form-input" value={formData.quantity} onChange={e => setFormData(p => ({ ...p, quantity: Number(e.target.value) }))} min={0} />
                      </div>
                    </div>
                  </>
                )}

                {formMode === 'lubricant' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Nombre *</label>
                      <input type="text" className="form-input" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Ej: Shell Omala S2 G 220" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tipo *</label>
                      <select className="form-select" value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}>
                        <option value="aceite">Aceite</option>
                        <option value="grasa">Grasa</option>
                      </select>
                    </div>
                    {formData.type === 'aceite' ? (
                      <div className="form-group">
                        <label className="form-label">Viscosidad</label>
                        <input type="text" className="form-input" value={formData.viscosity} onChange={e => setFormData(p => ({ ...p, viscosity: e.target.value }))} placeholder="Ej: ISO VG 220" />
                      </div>
                    ) : (
                      <div className="form-group">
                        <label className="form-label">Grado NLGI</label>
                        <input type="text" className="form-input" value={formData.nlgiGrade} onChange={e => setFormData(p => ({ ...p, nlgiGrade: e.target.value }))} placeholder="Ej: NLGI 2" />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  <Save style={{ width: 16, height: 16 }} /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .hierarchy-list {
          font-size: var(--text-sm);
        }

        .hierarchy-item {
          border-left: 2px solid var(--border);
          padding-left: var(--space-4);
          margin-left: var(--space-2);
        }

        .hierarchy-item.plant {
          border-color: var(--primary-300);
          margin-left: 0;
        }

        .hierarchy-item.area { border-color: #c4b5fd; }
        .hierarchy-item.machine { border-color: var(--warning-300); }
        .hierarchy-item.component { border-color: #a5b4fc; }
        .hierarchy-item.point { border-color: var(--accent-300); }

        .hierarchy-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) 0;
        }

        .hierarchy-name {
          font-weight: 500;
        }

        .hierarchy-code {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          background: var(--accent-100);
          color: var(--accent-600);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }

        .hierarchy-meta {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .hierarchy-children {
          padding-left: var(--space-2);
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          font-size: var(--text-xs);
          background: var(--slate-100);
          border: none;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          cursor: pointer;
          margin-left: auto;
          transition: all var(--duration-fast);
        }

        .add-btn:hover {
          background: var(--primary-100);
          color: var(--primary-600);
        }
      `}</style>
    </ProtectedRoute>
  );
}
