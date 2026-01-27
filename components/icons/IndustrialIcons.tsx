import React from 'react';

// Common props for all icons
interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    className?: string; // Allow passing Tailwind classes
}

// Internal base component for SVG wrapper
const IndustrialIconBase: React.FC<IconProps & { children: React.ReactNode }> = ({
    size = 24,
    color = 'currentColor',
    className,
    children,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        {children}
    </svg>
);

// --- Icons ---

// 1. Conveyor Belt (Cinta Transportadora)
export const ConveyorIcon: React.FC<IconProps> = (props) => (
    <IndustrialIconBase {...props}>
        <path d="M2 17h20" />
        <circle cx="5" cy="17" r="2" />
        <circle cx="19" cy="17" r="2" />
        <path d="M2 13h20" />
        <path d="M5 13v-4" />
        <path d="M19 13v-4" />
    </IndustrialIconBase>
);

// 2. Gearbox (Caja Reductora)
export const GearboxIcon: React.FC<IconProps> = (props) => (
    <IndustrialIconBase {...props}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="8" cy="12" r="3" />
        <circle cx="16" cy="12" r="2" />
        <path d="M8 12h8" />
    </IndustrialIconBase>
);

// 3. Pump (Bomba Centrífuga/Hidráulica)
export const PumpIcon: React.FC<IconProps> = (props) => (
    <IndustrialIconBase {...props}>
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <circle cx="12" cy="12" r="6" />
        <path d="M12 8a4 4 0 0 1 0 8" />
    </IndustrialIconBase>
);

// 4. Motor (Motor Eléctrico)
export const MotorIcon: React.FC<IconProps> = (props) => (
    <IndustrialIconBase {...props}>
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M20 12h2" />
        <path d="M2 12h2" />
        <path d="M12 6V4" />
        <circle cx="12" cy="12" r="3" />
        <path d="M10 12l2-2 2 2" />
    </IndustrialIconBase>
);

// 5. Bearing (Rodamiento)
export const BearingIcon: React.FC<IconProps> = (props) => (
    <IndustrialIconBase {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        {/* Balls */}
        <circle cx="18" cy="18" r="1" fill="currentColor" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
    </IndustrialIconBase>
);

// 6. Hydraulic Tank (Estanque Hidráulico)
export const TankIcon: React.FC<IconProps> = (props) => (
    <IndustrialIconBase {...props}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 14h16" />
        <path d="M8 4v-2" />
        <path d="M16 4v-2" />
        <path d="M6 18h2" />
    </IndustrialIconBase>
);

// 7. Valve (Válvula)
export const ValveIcon: React.FC<IconProps> = (props) => (
    <IndustrialIconBase {...props}>
        <path d="M4 10l8 8 8-8" />
        <path d="M4 10l8-8 8 8" />
        <path d="M12 10v4" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
    </IndustrialIconBase>
);

// 8. Filter (Filtro)
export const FilterIcon: React.FC<IconProps> = (props) => (
    <IndustrialIconBase {...props}>
        <path d="M4 6h16l-6 10v6l-4-2v-4z" />
        <line x1="4" y1="6" x2="20" y2="6" strokeWidth="4" />
    </IndustrialIconBase>
);

// 9. Chain (Cadena)
export const ChainIcon: React.FC<IconProps> = (props) => (
    <IndustrialIconBase {...props}>
        <rect x="2" y="8" width="8" height="8" rx="4" />
        <rect x="14" y="8" width="8" height="8" rx="4" />
        <path d="M8 12h8" />
    </IndustrialIconBase>
);
