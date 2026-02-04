'use client';

import { useState, useEffect } from 'react';
import { Activity, Wifi, AlertOctagon } from 'lucide-react';
import { dataService } from '@/lib/data';
import { Sensor } from '@/lib/types';

export default function IoTMonitor() {
    const [sensors, setSensors] = useState<Sensor[]>([]);

    useEffect(() => {
        // Initial load
        setSensors(dataService.getSensors());

        // Mock real-time updates
        const interval = setInterval(() => {
            setSensors(prev => prev.map(s => ({
                ...s,
                lastReading: s.type === 'vibration'
                    ? Math.max(0, s.lastReading + (Math.random() - 0.5)) // Random walk
                    : Math.max(20, s.lastReading + (Math.random() - 0.5)), // Temp variant
                status: Math.random() > 0.95 ? 'alert' : 'online' // Random alert simulation
            })));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Activity style={{ width: 20, height: 20, color: 'var(--primary-600)' }} />
                    <span className="card-title">IoT: Monitoreo en Tiempo Real</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ansi-green)' }}></span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>ONLINE</span>
                </div>
            </div>

            <div className="card-body">
                <div className="metrics-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {sensors.map(sensor => (
                        <div key={sensor.id} style={{
                            padding: '16px',
                            borderRadius: 'var(--radius-sm)',
                            background: sensor.status === 'alert' ? 'var(--accent-100)' : 'white',
                            border: `1px solid ${sensor.status === 'alert' ? 'var(--accent-500)' : 'var(--border)'}`,
                            borderLeft: `4px solid ${sensor.status === 'alert' ? 'var(--accent-500)' : 'var(--primary-600)'}`,
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                                    {sensor.machineId.replace(/-/g, ' ').toUpperCase()}
                                </div>
                                {sensor.status === 'alert' ? (
                                    <AlertOctagon style={{ width: 16, height: 16, color: 'var(--ansi-red)' }} />
                                ) : (
                                    <Wifi style={{ width: 16, height: 16, color: 'var(--ansi-green)' }} />
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: sensor.status === 'alert' ? 'var(--ansi-red)' : 'var(--primary-900)' }}>
                                    {sensor.lastReading.toFixed(1)}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sensor.unit}</span>
                            </div>

                            <div style={{ height: '6px', background: 'var(--slate-200)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min(100, (sensor.lastReading / (sensor.type === 'vibration' ? 10 : 100)) * 100)}%`,
                                    background: sensor.status === 'alert' ? 'var(--ansi-red)' : 'var(--primary-600)',
                                    transition: 'width 0.5s ease'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
