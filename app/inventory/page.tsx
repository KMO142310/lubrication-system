'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Package,
  AlertTriangle,
  ArrowUpRight,
  Search,
  Filter,
  MoreVertical,
  Plus
} from 'lucide-react';
import { dataService } from '@/lib/data';
import { InventoryItem, Lubricant } from '@/lib/types';

interface EnrichedInventoryItem extends InventoryItem {
  lubricant: Lubricant;
}

export default function InventoryPage() {
  const [items, setItems] = useState<EnrichedInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const loadInventory = () => {
      const inventory = dataService.getInventory();
      const lubricants = dataService.getLubricants();

      const enriched = inventory.map(item => ({
        ...item,
        lubricant: lubricants.find(l => l.id === item.lubricantId)!
      })).filter(i => i.lubricant); // Filter out orphans

      setItems(enriched);
      setLoading(false);
    };

    loadInventory();
  }, []);

  const lowStockItems = items.filter(i => i.quantity <= i.minStock);
  const totalValue = items.reduce((acc, item) => acc + (item.quantity * (item.lubricant.pricePerUnit || 0)), 0);

  const filteredItems = items.filter(item =>
    item.lubricant.name.toLowerCase().includes(filter.toLowerCase()) ||
    item.lubricant.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['desarrollador', 'supervisor']}>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-container">
            {/* Header */}
            <header className="page-header">
              <div className="page-header-top">
                <div>
                  <h1 className="page-title">Inventario de Lubricantes</h1>
                  <p className="page-subtitle">Control de stock y movimientos de bodega</p>
                </div>
                <button className="btn btn-primary">
                  <Plus style={{ width: 16, height: 16 }} />
                  Registrar Movimiento
                </button>
              </div>
            </header>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>{items.length}</div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>SKUs Activos</div>
                </div>
              </div>

              <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>{lowStockItems.length}</div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>Stock Crítico</div>
                </div>
              </div>

              <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpRight style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>${totalValue.toLocaleString('es-CL')}</div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>Valor Inventario (Est.)</div>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="card">
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Existencias</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="search-box">
                    <Search style={{ width: 16, height: 16, color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Buscar lubricante..."
                      style={{ border: 'none', outline: 'none', fontSize: '13px' }}
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-secondary btn-sm">
                    <Filter style={{ width: 14, height: 14 }} />
                    Filtros
                  </button>
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lubricante</th>
                    <th>Tipo</th>
                    <th>Stock Actual</th>
                    <th>Estado</th>
                    <th>Ubicación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px' }}>Cargando inventario...</td></tr>
                  ) : filteredItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.lubricant.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>ID: {item.lubricant.id.slice(0, 8)}</div>
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: item.lubricant.type === 'aceite' ? '#e0f2fe' : '#fef3c7',
                          color: item.lubricant.type === 'aceite' ? '#0369a1' : '#b45309',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}>
                          {item.lubricant.type}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '15px', fontWeight: 700 }}>
                          {item.quantity} {item.lubricant.type === 'grasa' ? 'kg' : 'L'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Min: {item.minStock} | Max: {item.maxStock}
                        </div>
                      </td>
                      <td>
                        {item.quantity <= item.minStock ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontWeight: 600, fontSize: '13px' }}>
                            <AlertTriangle style={{ width: 14, height: 14 }} />
                            Crítico
                          </span>
                        ) : (
                          <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '13px' }}>Normal</span>
                        )}
                      </td>
                      <td style={{ color: '#64748b' }}>{item.location || 'N/A'}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary">
                          <MoreVertical style={{ width: 16, height: 16 }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
