import React from 'react';

// Industrial Icons - Monochrome SVG for Lubrication System
// Based on ISO/ANSI industrial standards

interface IconProps {
    size?: number;
    className?: string;
    color?: string;
}

const defaultProps = {
    size: 24,
    className: '',
    color: 'currentColor'
};

// Grease Gun Icon
export const GreaseGunIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M2 12h4M6 10v4M6 12h3l2-2h4l1 1v2l-1 1h-4l-2-2H6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 12h4M20 10v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="12" r="1" fill={color} />
    </svg>
);

// Bearing Icon
export const BearingIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="4" r="1.5" fill={color} />
        <circle cx="12" cy="20" r="1.5" fill={color} />
        <circle cx="4" cy="12" r="1.5" fill={color} />
        <circle cx="20" cy="12" r="1.5" fill={color} />
        <circle cx="6.3" cy="6.3" r="1.2" fill={color} />
        <circle cx="17.7" cy="17.7" r="1.2" fill={color} />
        <circle cx="17.7" cy="6.3" r="1.2" fill={color} />
        <circle cx="6.3" cy="17.7" r="1.2" fill={color} />
    </svg>
);

// Gearbox Icon
export const GearboxIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3" y="6" width="18" height="12" rx="1" stroke={color} strokeWidth="1.5" />
        <circle cx="8" cy="12" r="2.5" stroke={color} strokeWidth="1.5" />
        <circle cx="16" cy="12" r="2.5" stroke={color} strokeWidth="1.5" />
        <path d="M10.5 12h3" stroke={color} strokeWidth="1.5" />
        <path d="M8 4v2M16 4v2M8 18v2M16 18v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Oil Drop Icon
export const OilDropIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2C12 2 6 9 6 14a6 6 0 0012 0c0-5-6-12-6-12z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 14a2 2 0 104 0c0-2-2-5-2-5s-2 3-2 5z" fill={color} opacity="0.3" />
    </svg>
);

// Pump Icon
export const PumpIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="14" r="6" stroke={color} strokeWidth="1.5" />
        <path d="M12 8V4M9 4h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 14l3-3 3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 14H2M22 14h-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Motor Icon
export const MotorIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="4" y="7" width="12" height="10" rx="1" stroke={color} strokeWidth="1.5" />
        <path d="M16 10h4v4h-4" stroke={color} strokeWidth="1.5" />
        <path d="M20 12h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M7 7V5M10 7V5M13 7V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 17v2M10 17v2M13 17v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Chain Icon
export const ChainIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2" y="8" width="6" height="8" rx="3" stroke={color} strokeWidth="1.5" />
        <rect x="9" y="8" width="6" height="8" rx="3" stroke={color} strokeWidth="1.5" />
        <rect x="16" y="8" width="6" height="8" rx="3" stroke={color} strokeWidth="1.5" />
        <path d="M8 12h1M15 12h1" stroke={color} strokeWidth="1.5" />
    </svg>
);

// Spindle/Husillo Icon
export const SpindleIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 12h16" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="6" cy="12" r="3" stroke={color} strokeWidth="1.5" />
        <circle cx="18" cy="12" r="3" stroke={color} strokeWidth="1.5" />
        <path d="M12 9v6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// Compressor Icon (Cylinder style)
export const CompressorIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="6" y="4" width="12" height="16" rx="2" stroke={color} strokeWidth="1.5" />
        <path d="M6 8h12M6 16h12" stroke={color} strokeWidth="1.5" />
        <path d="M12 4V2M12 22v-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="1.5" />
    </svg>
);

// Valve Icon
export const ValveIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M2 12h6l2-4h4l2 4h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="3" r="1" fill={color} />
    </svg>
);

// Pressure Gauge Icon
export const PressureGaugeIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
        <path d="M12 12l4-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill={color} />
        <path d="M12 5v1M19 12h-1M5 12h1M17 7l-.7.7M7 7l.7.7" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
);

// Wrench/Maintenance Icon
export const MaintenanceIcon = ({ size = 24, className = '', color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 11-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);

// Export all icons as a single object for convenience
export const IndustrialIcons = {
    GreaseGun: GreaseGunIcon,
    Bearing: BearingIcon,
    Gearbox: GearboxIcon,
    OilDrop: OilDropIcon,
    Pump: PumpIcon,
    Motor: MotorIcon,
    Chain: ChainIcon,
    Spindle: SpindleIcon,
    Compressor: CompressorIcon,
    Valve: ValveIcon,
    PressureGauge: PressureGaugeIcon,
    Maintenance: MaintenanceIcon,
};
