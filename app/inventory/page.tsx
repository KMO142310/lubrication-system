'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { Droplets, Package } from 'lucide-react';
import { dataService } from '@/lib/data';
import { Lubricant } from '@/lib/types';

export default function InventoryPage() {
  const [lubricants, setLubricants] = useState<(Lubricant & { usage: number; pointCount: number })[]>([]);

  useEffect(() => {
    const lubs = dataService.getLubricants();
    const points = dataService.getLubricationPoints();
    const tasks = dataService.getTasks();

    const enriched = lubs.map(lub => {
      const lubPoints = points.filter(p => p.lubricantId === lub.id);
      const usage = tasks
        .filter(t => t.status === 'completado')
        .filter(t => lubPoints.some(p => p.id === t.lubricationPointId))
        .reduce((acc, t) => acc + (t.quantityUsed || 0), 0);

      return { ...lub, usage, pointCount: lubPoints.length };
    });

    setLubricants(enriched);
  }, []);

  const oils = lubricants.filter(l => l.type === 'aceite');
  const greases = lubricants.filter(l => l.type === 'grasa');
  const totalOilUsage = oils.reduce((acc, l) => acc + l.usage, 0);
  const totalGreaseUsage = greases.reduce((acc, l) => acc + l.usage, 0);

  return (
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
            <h1 className="page-title">Inventario de Lubricantes</h1>
            <p className="page-subtitle">Control de stock y consumo</p>
          </header>

          <div className="dashboard-grid">
            {/* Summary Cards */}
            <div className="col-span-6">
              <div className="stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--space-6)' }}>
                <div className="stat-icon primary"><Droplets style={{ width: 24, height: 24 }} /></div>
                <div>
                  <span className="stat-value">{oils.length}</span>
                  <span className="stat-label">Aceites</span>
                </div>
                <span style={{ marginLeft: 'auto', background: 'var(--slate-100)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  {totalOilUsage > 0 ? Math.round(totalOilUsage / 1000) : 0} L usados
                </span>
              </div>
            </div>
            <div className="col-span-6">
              <div className="stat-card" style={{ flexDirection: 'row', alignItems: 'center', gap: 'var(--space-6)' }}>
                <div className="stat-icon warning"><Package style={{ width: 24, height: 24 }} /></div>
                <div>
                  <span className="stat-value">{greases.length}</span>
                  <span className="stat-label">Grasas</span>
                </div>
                <span style={{ marginLeft: 'auto', background: 'var(--slate-100)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  {totalGreaseUsage > 0 ? Math.round(totalGreaseUsage / 1000) : 0} kg usados
                </span>
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
                        <th>Viscosidad</th>
                        <th>Puntos</th>
                        <th>Consumo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {oils.map(lub => (
                        <tr key={lub.id}>
                          <td className="cell-primary">{lub.name}</td>
                          <td>{lub.viscosity || '-'}</td>
                          <td>{lub.pointCount}</td>
                          <td>{lub.usage > 0 ? Math.round(lub.usage / 1000) : 0} L</td>
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
                        <th>Grado NLGI</th>
                        <th>Puntos</th>
                        <th>Consumo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {greases.map(lub => (
                        <tr key={lub.id}>
                          <td className="cell-primary">{lub.name}</td>
                          <td>{lub.nlgiGrade || '-'}</td>
                          <td>{lub.pointCount}</td>
                          <td>{lub.usage > 0 ? Math.round(lub.usage / 1000) : 0} kg</td>
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
  );
}
