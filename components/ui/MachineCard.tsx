'use client';

import React from 'react';
import { EquipmentTag } from './EquipmentTag';
import { LEDIndicator } from './LEDIndicator';

interface MachineCardProps {
    name: string;
    code: string;
    status: 'on' | 'off' | 'warning' | 'alarm';
    image?: string; // URL or Lucide Icon component could be passed here
    metrics?: { label: string; value: string | number }[];
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

export const MachineCard = ({
    name,
    code,
    status,
    image,
    metrics = [],
    onClick,
    className = '',
    children
}: MachineCardProps) => {

    const statusBorderMap = {
        on: 'border-l-[var(--ansi-green)]',
        off: 'border-l-[var(--metal-500)]',
        warning: 'border-l-[var(--ansi-yellow)]',
        alarm: 'border-l-[var(--ansi-red)]'
    };

    return (
        <div
            onClick={onClick}
            className={`
        panel relative hover:translate-y-[-2px] transition-transform cursor-pointer
        border-l-4 ${statusBorderMap[status]}
        ${className}
      `}
        >
            {/* Screw heads visual effect (Industrial detail) */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[var(--metal-600)] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8),1px_1px_0_rgba(255,255,255,0.1)]"></div>
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--metal-600)] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8),1px_1px_0_rgba(255,255,255,0.1)]"></div>
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[var(--metal-600)] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8),1px_1px_0_rgba(255,255,255,0.1)]"></div>
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--metal-600)] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8),1px_1px_0_rgba(255,255,255,0.1)]"></div>

            <div className="p-4 pl-5"> {/* Extra padding-left for the border */}
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <EquipmentTag code={code} className="mb-2" />
                        <h3 className="text-sm font-bold text-[var(--text-highlight)] uppercase tracking-wide leading-tight">
                            {name}
                        </h3>
                    </div>
                    <LEDIndicator status={status} size="md" />
                </div>

                {/* Content Area */}
                {children && <div className="mb-3">{children}</div>}

                {/* Metrics Grid */}
                {metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 border-t border-[var(--metal-600)] pt-2 mt-2">
                        {metrics.map((metric, idx) => (
                            <div key={idx} className="flex flex-col">
                                <span className="text-[10px] text-[var(--text-secondary)] uppercase">{metric.label}</span>
                                <span className="font-mono font-bold text-sm text-[var(--text-primary)]">{metric.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
