'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn exists or constructing classStr manually

interface MetricCardProps {
    label: string;
    value: string | number;
    subValue?: string; // e.g. /100 or %
    icon: LucideIcon;
    href: string;
    colorTheme: 'success' | 'warning' | 'danger' | 'primary' | 'info' | 'violet';
    badgeText?: string;
    footerText?: string;
}

const THEMES = {
    success: {
        gradient: 'from-green-500 to-green-600', // simplified logic for gradient borders/bgs
        iconColor: '#22c55e',
        iconBg: 'rgba(34, 197, 94, 0.15)',
        barGradient: 'linear-gradient(90deg, #22c55e, #16a34a)',
    },
    warning: {
        iconColor: '#f59e0b',
        iconBg: 'rgba(245, 158, 11, 0.15)',
        barGradient: 'linear-gradient(90deg, #f59e0b, #d97706)',
    },
    danger: {
        iconColor: '#ef4444',
        iconBg: 'rgba(239, 68, 68, 0.15)',
        barGradient: 'linear-gradient(90deg, #ef4444, #dc2626)',
    },
    primary: {
        iconColor: '#3b82f6',
        iconBg: 'rgba(59, 130, 246, 0.15)',
        barGradient: 'linear-gradient(90deg, #3b82f6, #2563eb)',
    },
    violet: {
        iconColor: '#8b5cf6',
        iconBg: 'rgba(139, 92, 246, 0.15)',
        barGradient: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
    },
    info: {
        iconColor: '#0ea5e9',
        iconBg: 'rgba(14, 165, 233, 0.15)',
        barGradient: 'linear-gradient(90deg, #0ea5e9, #0284c7)',
    }
};

export default function MetricCard({
    label,
    value,
    subValue,
    icon: Icon,
    href,
    colorTheme,
    badgeText,
    footerText
}: MetricCardProps) {
    const theme = THEMES[colorTheme] || THEMES.primary;

    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div className="kpi-clickable" style={{
                background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #334155',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}>
                {/* Top Bar */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: theme.barGradient,
                }} />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        background: theme.iconBg,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Icon style={{ width: 22, height: 22, color: theme.iconColor }} />
                    </div>

                    {badgeText && (
                        <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: theme.iconColor,
                            background: theme.iconBg,
                            padding: '4px 10px',
                            borderRadius: '20px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}>
                            {badgeText}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                    {value}<span style={{ fontSize: '20px', opacity: 0.6 }}>{subValue}</span>
                </div>

                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {label}
                </div>

                {/* Footer */}
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {footerText || `Ver ${label.toLowerCase()}`} <ArrowRight style={{ width: 12, height: 12 }} />
                </div>
            </div>
        </Link>
    );
}
