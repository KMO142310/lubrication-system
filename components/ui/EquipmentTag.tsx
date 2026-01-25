import React from 'react';

interface EquipmentTagProps {
    code: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const EquipmentTag = ({ code, size = 'md', className = '' }: EquipmentTagProps) => {
    const sizeClasses = {
        sm: 'text-[10px] py-[1px] px-1',
        md: 'text-xs py-0.5 px-1.5',
        lg: 'text-sm py-1 px-2'
    };

    return (
        <span
            className={`
        font-mono font-bold text-[var(--metal-900)] bg-[var(--metal-300)] 
        border border-[var(--metal-400)] rounded-[1px] shadow-sm select-all
        inline-flex items-center justify-center tracking-tight
        ${sizeClasses[size]} 
        ${className}
      `}
            title={`Equipment ID: ${code}`}
        >
            {code}
        </span>
    );
};
