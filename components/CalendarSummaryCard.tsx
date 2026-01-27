import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CalendarSummaryCardProps {
    icon: LucideIcon;
    value: number;
    label: string;
    gradient: string;
}

export default function CalendarSummaryCard({
    icon: Icon,
    value,
    label,
    gradient
}: CalendarSummaryCardProps) {
    return (
        <div className="stat-card" style={{ background: gradient }}>
            <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Icon style={{ width: 24, height: 24, color: 'white' }} />
            </div>
            <div className="stat-content">
                <span className="stat-value" style={{ color: 'white' }}>{value}</span>
                <span className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>{label}</span>
            </div>
        </div>
    );
}
