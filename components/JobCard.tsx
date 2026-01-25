'use client';

import { CheckCircle2, Circle, Droplets, Settings, Play } from 'lucide-react';
import { Task, LubricationPoint, Machine, Lubricant, Frequency, Component } from '@/lib/types';

interface EnrichedTask extends Task {
    lubricationPoint: LubricationPoint;
    component: Component;
    machine: Machine;
    lubricant: Lubricant;
    frequency: Frequency;
}

interface JobCardProps {
    task: EnrichedTask;
    onClick: (task: EnrichedTask) => void;
}

export default function JobCard({ task, onClick }: JobCardProps) {
    const isCompleted = task.status === 'completado';

    // Determinar color de borde basado en frecuencia
    const getFrequencyColor = (freqId: string) => {
        if (freqId.includes('8hrs') || freqId.includes('diari') || freqId.includes('dia')) return 'var(--freq-daily)';
        if (freqId.includes('40hrs') || freqId.includes('semanal')) return 'var(--freq-weekly)';
        if (freqId.includes('160hrs') || freqId.includes('quincenal')) return 'var(--freq-biweekly)';
        if (freqId.includes('mensual')) return 'var(--freq-monthly)';
        if (freqId.includes('trimestral')) return 'var(--freq-quarterly)';
        if (freqId.includes('semestral')) return 'var(--freq-semiannual)';
        if (freqId.includes('anual')) return 'var(--freq-annual)';
        return 'var(--primary-500)';
    };

    const borderColor = getFrequencyColor(task.lubricationPoint.frequencyId);

    return (
        <div
            onClick={() => !isCompleted && onClick(task)}
            className={`job-card ${isCompleted ? 'completed' : ''}`}
            style={{ borderLeftColor: isCompleted ? 'var(--success-500)' : borderColor } as React.CSSProperties}
        >
            <div className="job-card-content">
                <div className="job-card-header">
                    <span className="job-code">{task.lubricationPoint.code}</span>
                    <div className={`job-status ${task.status}`}>
                        {isCompleted ? (
                            <div className="status-badge success">
                                <CheckCircle2 size={16} /> <span>LISTO</span>
                            </div>
                        ) : (
                            <div className="status-badge pending">
                                <Circle size={16} /> <span>PENDIENTE</span>
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="job-machine">{task.machine.name}</h3>
                <p className="job-component">{task.component.name} • {task.lubricationPoint.description}</p>

                <div className="job-details">
                    <div className="detail-item">
                        <Droplets size={16} className="text-primary" />
                        <span className="font-bold">{task.lubricant.name}</span>
                    </div>
                    <div className="detail-item">
                        <Settings size={16} className="text-muted" />
                        <span>{task.lubricationPoint.method}</span>
                    </div>
                </div>
            </div>

            {!isCompleted && (
                <div className="job-action">
                    <button className="action-btn">
                        <Play size={24} fill="currentColor" />
                    </button>
                </div>
            )}

            <style jsx>{`
        .job-card {
            background: var(--surface);
            border: 2px solid var(--border);
            border-left-width: 8px; /* Indicador visual fuerte de frecuencia/estado */
            border-radius: var(--radius-lg);
            display: flex;
            overflow: hidden;
            transition: all var(--duration-fast);
            cursor: pointer;
            box-shadow: var(--shadow-sm);
            min-height: 140px;
        }

        .job-card:hover:not(.completed) {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: var(--primary-300);
            /* Mantener el border-left-color original en el estilo inline */
        }

        .job-card.completed {
            background: var(--slate-50);
            opacity: 0.8;
            cursor: default;
            border-color: var(--border-subtle);
        }

        .job-card-content {
            flex: 1;
            padding: var(--space-4);
            display: flex;
            flex-direction: column;
        }

        .job-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-2);
        }

        .job-code {
            font-family: var(--font-mono);
            font-weight: 800;
            font-size: var(--text-sm);
            color: var(--text-secondary);
            background: var(--slate-100);
            padding: 2px 6px;
            border-radius: 4px;
        }

        .status-badge {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: var(--text-xs);
            font-weight: 800;
            padding: 4px 8px;
            border-radius: var(--radius-full);
            letter-spacing: 0.05em;
        }

        .status-badge.success {
            background: var(--success-100);
            color: var(--success-600);
        }

        .status-badge.pending {
            background: var(--warning-100);
            color: var(--warning-600);
        }

        .job-machine {
            font-size: var(--text-lg);
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: 2px;
            line-height: 1.2;
        }

        .job-component {
            font-size: var(--text-sm);
            color: var(--text-secondary);
            margin-bottom: var(--space-4);
            font-weight: 500;
        }

        .job-details {
            margin-top: auto;
            display: flex;
            gap: var(--space-4);
            flex-wrap: wrap;
        }

        .detail-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: var(--text-sm);
            color: var(--text-primary);
            background: var(--slate-100);
            padding: 4px 8px;
            border-radius: 4px;
        }

        .text-primary { color: var(--primary-600); }
        .text-muted { color: var(--text-muted); }

        .job-action {
            width: 80px;
            background: var(--primary-50);
            display: flex;
            align-items: center;
            justify-content: center;
            border-left: 1px solid var(--border);
        }

        .action-btn {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--primary-600);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: var(--shadow-md);
            transition: transform var(--duration-fast);
        }

        .job-card:hover .action-btn {
            transform: scale(1.1);
            background: var(--primary-500);
        }

        /* Mobile optimization */
        @media (max-width: 640px) {
            .job-card {
                flex-direction: column;
            }
            .job-action {
                width: 100%;
                height: 60px;
                border-left: none;
                border-top: 1px solid var(--border);
                flex-direction: row;
            }
             .action-btn {
                width: 100%;
                height: 100%;
                border-radius: 0;
                background: var(--primary-600);
                gap: 8px;
            }
            .action-btn::after {
                content: "EJECUTAR TAREA";
                font-weight: 800;
                font-size: 14px;
            }
        }
      `}</style>
        </div>
    );
}
