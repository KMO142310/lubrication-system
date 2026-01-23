'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Droplets, Package, Info } from 'lucide-react';
import { dataService } from '@/lib/data';
import { Lubricant } from '@/lib/types';

export default function InventoryPage() {
  const [lubricants, setLubricants] = useState<Lubricant[]>([]);

  useEffect(() => {
    setLubricants(dataService.getLubricants());
  }, []);

  const oils = lubricants.filter(l => l.type === 'aceite');
  const greases = lubricants.filter(l => l.type === 'grasa');

  return (
    <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <div className="page-container">
            <nav className="breadcrumb">
              <Link href="/" className="breadcrumb-link">Dashboard</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Inventario</span>
            </nav>

            <header className="page-header">
              <h1 className="page-title">Lubricantes Disponibles</h1>
              <p className="page-subtitle">Catálogo de lubricantes según manual de operaciones</p>
            </header>

            {/* Info Banner */}
            <div style={{
              background: '#eff6ff',
              border: '1px solid #3b82f6',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}>
              <Info style={{ width: 20, height: 20, color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '14px', color: '#1e40af' }}>
                <strong>Nota:</strong> Este catálogo está basado en el manual de lubricación AISA. 
                Los nombres y especificaciones están sujetos a cambios según proveedor.
              </div>
            </div>

            <div className="dashboard-grid">
              {/* Summary Cards */}
              <div className="col-span-6">
                <div className="stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--space-6)' }}>
                  <div className="stat-icon primary"><Droplets style={{ width: 24, height: 24 }} /></div>
                  <div>
                    <span className="stat-value">{oils.length}</span>
                    <span className="stat-label">Aceites</span>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--space-6)' }}>
                  <div className="stat-icon warning"><Package style={{ width: 24, height: 24 }} /></div>
                  <div>
                    <span className="stat-value">{greases.length}</span>
                    <span className="stat-label">Grasas</span>
                  </div>
                </div>
              </div>

              {/* Oils Table */}
              <div className="col-span-12">
                <div className="card">
                  <div className="card-header"><span className="card-title">Aceites</span></div>
                  <div className="data-table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Tipo</th>
                          <th>Viscosidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {oils.map(lub => (
                          <tr key={lub.id}>
                            <td className="cell-primary">{lub.name}</td>
                            <td>
                              <span style={{
                                background: '#dbeafe',
                                color: '#1e40af',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}>Aceite</span>
                            </td>
                            <td>{lub.viscosity || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Greases Table */}
              <div className="col-span-12">
                <div className="card">
                  <div className="card-header"><span className="card-title">Grasas</span></div>
                  <div className="data-table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Tipo</th>
                          <th>Grado NLGI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {greases.map(lub => (
                          <tr key={lub.id}>
                            <td className="cell-primary">{lub.name}</td>
                            <td>
                              <span style={{
                                background: '#fef3c7',
                                color: '#92400e',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}>Grasa</span>
                            </td>
                            <td>{lub.nlgiGrade || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
