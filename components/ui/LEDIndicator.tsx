import React from 'react';

type LEDStatus = 'on' | 'off' | 'warning' | 'alarm' | 'info';

interface LEDIndicatorProps {
    status: LEDStatus;
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    className?: string;
}

export const LEDIndicator = ({ status, size = 'md', label, className = '' }: LEDIndicatorProps) => {
    const sizeMap = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    const getStatusClass = (s: LEDStatus) => {
        switch (s) {
            case 'on': return 'bg-[var(--led-on)] shadow-[0_0_8px_var(--led-on)]';
            case 'off': return 'bg-[var(--led-off)]';
            case 'warning': return 'bg-[var(--led-warning)] shadow-[0_0_6px_var(--led-warning)]';
            case 'alarm': return 'bg-[var(--led-alarm)] shadow-[0_0_8px_var(--led-alarm)] animate-pulse';
            case 'info': return 'bg-[var(--led-info)] shadow-[0_0_6px_var(--led-info)]';
            default: return 'bg-[var(--led-off)]';
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div
                className={`rounded-full border border-[rgba(0,0,0,0.3)] shadow-inner transition-colors duration-300 ${sizeMap[size]} ${getStatusClass(status)}`}
                role="status"
                aria-label={`Status: ${status}`}
            />
            {label && <span className="text-[var(--text-secondary)] text-xs font-mono uppercase tracking-wider">{label}</span>}
        </div>
    );
};
