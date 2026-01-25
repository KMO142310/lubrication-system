'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Droplets,
    Clock,
    CheckCircle,
    Info,
} from 'lucide-react';
import {
    generarCalendarioMes,
    getResumenTareas,
    type CalendarioMes,
    type Turno,
} from '@/lib/calendar-utils';

export default function CalendarioPage() {
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentMonth, setCurrentMonth] = useState(0); // Enero
    const [turnoUsuario, setTurnoUsuario] = useState<Turno>('B');
    const [calendario, setCalendario] = useState<CalendarioMes | null>(null);
    const [resumen, setResumen] = useState<ReturnType<typeof getResumenTareas> | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    useEffect(() => {
        const cal = generarCalendarioMes(currentYear, currentMonth, turnoUsuario);
        setCalendario(cal);
        setResumen(getResumenTareas());
        setSelectedDay(null);
    }, [currentYear, currentMonth, turnoUsuario]);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(y => y - 1);
        } else {
            setCurrentMonth(m => m - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(y => y + 1);
        } else {
            setCurrentMonth(m => m + 1);
        }
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentYear(today.getFullYear());
        setCurrentMonth(today.getMonth());
    };

    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const primerDiaSemana = calendario ? new Date(currentYear, currentMonth, 1).getDay() : 0;
    const today = new Date();
    const isToday = (fecha: Date) =>
        fecha.getDate() === today.getDate() &&
        fecha.getMonth() === today.getMonth() &&
        fecha.getFullYear() === today.getFullYear();

    const selectedDia = selectedDay && calendario
        ? calendario.dias.find(d => d.fecha.getDate() === selectedDay)
        : null;

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-container">
                    <nav className="breadcrumb">
                        <Link href="/" className="breadcrumb-link">Dashboard</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link href="/schedule" className="breadcrumb-link">Planificación</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">Calendario</span>
                    </nav>

                    <header className="page-header">
                        <div className="page-header-top">
                            <div>
                                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Calendar style={{ width: 28, height: 28, color: 'var(--accent-500)' }} />
                                    Calendario de Lubricación
                                </h1>
                                <p className="page-subtitle">Planificación de tareas Enero - Febrero 2026</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <select
                                    value={turnoUsuario}
                                    onChange={(e) => setTurnoUsuario(e.target.value as Turno)}
                                    className="form-select"
                                    style={{ minWidth: '140px' }}
                                >
                                    <option value="A">Turno A (L-V)</option>
                                    <option value="B">Turno B (M-S)</option>
                                </select>
                                <button className="btn btn-secondary" onClick={goToToday}>
                                    Hoy
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Resumen */}
                    {resumen && (
                        <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
                            <div className="col-span-3">
                                <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%)' }}>
                                    <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
                                        <Droplets style={{ width: 24, height: 24, color: 'white' }} />
                                    </div>
                                    <div className="stat-content">
                                        <span className="stat-value" style={{ color: 'white' }}>{resumen.diarias}</span>
                                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Diarias</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%)' }}>
                                    <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
                                        <Clock style={{ width: 24, height: 24, color: 'white' }} />
                                    </div>
                                    <div className="stat-content">
                                        <span className="stat-value" style={{ color: 'white' }}>{resumen.semanales}</span>
                                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Semanales</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%)' }}>
                                    <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
                                        <CheckCircle style={{ width: 24, height: 24, color: 'white' }} />
                                    </div>
                                    <div className="stat-content">
                                        <span className="stat-value" style={{ color: 'white' }}>{resumen.mensuales}</span>
                                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Mensuales</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--warning-500) 0%, var(--warning-600) 100%)' }}>
                                    <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
                                        <Info style={{ width: 24, height: 24, color: 'white' }} />
                                    </div>
                                    <div className="stat-content">
                                        <span className="stat-value" style={{ color: 'white' }}>{resumen.total}</span>
                                        <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Puntos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="dashboard-grid">
                        {/* Calendario */}
                        <div className="col-span-8">
                            <div className="card">
                                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <button
                                        onClick={prevMonth}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                                    >
                                        <ChevronLeft style={{ width: 24, height: 24 }} />
                                    </button>
                                    <span className="card-title" style={{ fontSize: '18px' }}>
                                        {calendario?.nombreMes} {currentYear}
                                    </span>
                                    <button
                                        onClick={nextMonth}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                                    >
                                        <ChevronRight style={{ width: 24, height: 24 }} />
                                    </button>
                                </div>
                                <div className="card-body" style={{ padding: '16px' }}>
                                    {/* Cabecera días */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        gap: '4px',
                                        marginBottom: '8px',
                                    }}>
                                        {diasSemana.map(dia => (
                                            <div key={dia} style={{
                                                textAlign: 'center',
                                                fontWeight: 600,
                                                fontSize: '12px',
                                                color: 'var(--text-muted)',
                                                padding: '8px',
                                            }}>
                                                {dia}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Grid calendario */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(7, 1fr)',
                                        gap: '4px',
                                    }}>
                                        {/* Espacios vacíos al inicio */}
                                        {Array.from({ length: primerDiaSemana }).map((_, i) => (
                                            <div key={`empty-${i}`} style={{ aspectRatio: '1', minHeight: '60px' }} />
                                        ))}

                                        {/* Días del mes */}
                                        {calendario?.dias.map(dia => (
                                            <div
                                                key={dia.fecha.getDate()}
                                                onClick={() => setSelectedDay(dia.fecha.getDate())}
                                                style={{
                                                    aspectRatio: '1',
                                                    minHeight: '60px',
                                                    padding: '6px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    border: selectedDay === dia.fecha.getDate()
                                                        ? '2px solid var(--primary-500)'
                                                        : '1px solid var(--border-subtle)',
                                                    background: isToday(dia.fecha)
                                                        ? 'var(--primary-50)'
                                                        : dia.esTrabajo
                                                            ? 'white'
                                                            : 'var(--slate-100)',
                                                    transition: 'all 0.2s ease',
                                                    opacity: dia.esTrabajo ? 1 : 0.6,
                                                }}
                                            >
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                }}>
                                                    <span style={{
                                                        fontWeight: isToday(dia.fecha) ? 700 : 500,
                                                        fontSize: '14px',
                                                        color: isToday(dia.fecha) ? 'var(--primary-600)' : 'inherit',
                                                    }}>
                                                        {dia.fecha.getDate()}
                                                    </span>
                                                    <span style={{
                                                        fontSize: '10px',
                                                        fontWeight: 600,
                                                        color: dia.turno === 'A' ? 'var(--primary-600)' : 'var(--accent-600)',
                                                        background: dia.turno === 'A' ? 'var(--primary-100)' : 'var(--accent-100)',
                                                        padding: '2px 4px',
                                                        borderRadius: '4px',
                                                    }}>
                                                        {dia.turno}
                                                    </span>
                                                </div>
                                                {dia.esTrabajo && dia.totalTareas > 0 && (
                                                    <div style={{
                                                        marginTop: '4px',
                                                        fontSize: '11px',
                                                        color: 'var(--success-600)',
                                                        fontWeight: 600,
                                                    }}>
                                                        {dia.totalTareas} tareas
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel de detalle */}
                        <div className="col-span-4">
                            <div className="card" style={{ position: 'sticky', top: '20px' }}>
                                <div className="card-header">
                                    <span className="card-title">
                                        {selectedDia
                                            ? `${selectedDia.fecha.getDate()} ${calendario?.nombreMes}`
                                            : 'Selecciona un día'}
                                    </span>
                                </div>
                                <div className="card-body">
                                    {selectedDia ? (
                                        <>
                                            <div style={{
                                                display: 'flex',
                                                gap: '12px',
                                                marginBottom: '16px',
                                                padding: '12px',
                                                background: 'var(--slate-50)',
                                                borderRadius: '8px',
                                            }}>
                                                <div style={{ flex: 1, textAlign: 'center' }}>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Turno</div>
                                                    <div style={{
                                                        fontWeight: 700,
                                                        color: selectedDia.turno === 'A' ? 'var(--primary-600)' : 'var(--accent-600)',
                                                    }}>
                                                        {selectedDia.turno}
                                                    </div>
                                                </div>
                                                <div style={{ flex: 1, textAlign: 'center' }}>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estado</div>
                                                    <div style={{ fontWeight: 700 }}>
                                                        {selectedDia.esTrabajo ? '✅ Día laboral' : '⬜ Libre'}
                                                    </div>
                                                </div>
                                                <div style={{ flex: 1, textAlign: 'center' }}>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tareas</div>
                                                    <div style={{ fontWeight: 700, color: 'var(--success-600)' }}>
                                                        {selectedDia.totalTareas}
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedDia.tareas.length > 0 ? (
                                                <div style={{
                                                    maxHeight: '350px',
                                                    overflowY: 'auto',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '8px',
                                                }}>
                                                    {selectedDia.tareas.slice(0, 15).map(tarea => (
                                                        <div
                                                            key={tarea.id}
                                                            style={{
                                                                padding: '10px',
                                                                background: 'var(--slate-50)',
                                                                borderRadius: '6px',
                                                                borderLeft: '3px solid var(--primary-500)',
                                                            }}
                                                        >
                                                            <div style={{ fontWeight: 600, fontSize: '13px' }}>
                                                                {tarea.description}
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                                Código: {tarea.code} • {tarea.quantity}g
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {selectedDia.tareas.length > 15 && (
                                                        <div style={{
                                                            textAlign: 'center',
                                                            color: 'var(--text-muted)',
                                                            fontSize: '12px',
                                                            padding: '8px',
                                                        }}>
                                                            +{selectedDia.tareas.length - 15} tareas más
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{
                                                    textAlign: 'center',
                                                    padding: '32px',
                                                    color: 'var(--text-muted)',
                                                }}>
                                                    {selectedDia.esTrabajo
                                                        ? 'No hay tareas programadas'
                                                        : 'Día de descanso'}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '48px 24px',
                                            color: 'var(--text-muted)',
                                        }}>
                                            <Calendar style={{ width: 48, height: 48, marginBottom: '12px', opacity: 0.5 }} />
                                            <p>Haz clic en un día del calendario para ver las tareas programadas</p>
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
