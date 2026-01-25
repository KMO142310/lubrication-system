'use client';

import { useState, useEffect } from 'react';
import { Activity, Wifi, WifiOff, Thermometer, AlertOctagon } from 'lucide-react';
import { dataService } from '@/lib/data';
import { Sensor } from '@/lib/types';

export default function IoTMonitor() {
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [lastUpdate, setLastUpdate] = useState(new Date());

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
            setLastUpdate(new Date());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Activity style={{ width: 20, height: 20, color: '#3b82f6' }} />
                    <span className="card-title">IoT: Monitoreo en Tiempo Real</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }}></span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>En Vivo</span>
                </div>
            </div>

            <div className="card-body">
                <div className="metrics-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {sensors.map(sensor => (
                        <div key={sensor.id} style={{
                            padding: '16px',
                            borderRadius: '12px',
                            background: sensor.status === 'alert' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(241, 245, 249, 0.5)',
                            border: `1px solid ${sensor.status === 'alert' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(226, 232, 240, 0.8)'}`,
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                                    {sensor.machineId.replace(/-/g, ' ').toUpperCase()}
                                </div>
                                {sensor.status === 'alert' ? (
                                    <AlertOctagon style={{ width: 16, height: 16, color: '#ef4444' }} />
                                ) : (
                                    <Wifi style={{ width: 16, height: 16, color: '#22c55e' }} />
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '24px', fontWeight: 700, color: sensor.status === 'alert' ? '#ef4444' : '#1e293b' }}>
                                    {sensor.lastReading.toFixed(1)}
                                </span>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>{sensor.unit}</span>
                            </div>

                            <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min(100, (sensor.lastReading / (sensor.type === 'vibration' ? 10 : 100)) * 100)}%`,
                                    background: sensor.status === 'alert' ? '#ef4444' : '#3b82f6',
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
