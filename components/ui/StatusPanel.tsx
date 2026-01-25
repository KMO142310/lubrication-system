'use client';

import React from 'react';

interface StatusPanelProps {
    title: string;
    subtitle?: string;
    className?: string;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
}

export const StatusPanel = ({
    title,
    subtitle,
    className = '',
    headerAction,
    children
}: StatusPanelProps) => {
    return (
        <div className={`
      bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)]
      shadow-[var(--shadow-panel)] overflow-hidden flex flex-col
      ${className}
    `}>
            {/* Heavy Industrial Header */}
            <div className="
        bg-[var(--metal-800)] border-b border-[var(--metal-900)] 
        p-3 px-4 flex justify-between items-center relative
      ">
                {/* Striped construction tape effect at top (subtle) */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--metal-600)] to-[var(--metal-500)] opacity-50"></div>

                <div>
                    <h2 className="text-[var(--text-highlight)] font-display text-lg tracking-wide uppercase leading-none">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-widest mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>

                {headerAction && (
                    <div className="flex items-center">
                        {headerAction}
                    </div>
                )}
            </div>

            {/* Panel Body */}
            <div className="p-4 flex-1 overflow-auto bg-[var(--background)]/30">
                {children}
            </div>

            {/* Footer / Bolt Decoration */}
            <div className="h-2 bg-[var(--metal-700)] border-t border-[var(--metal-600)] flex justify-between px-2 items-center">
                <div className="w-1 h-1 rounded-full bg-[var(--metal-500)]"></div>
                <div className="w-1 h-1 rounded-full bg-[var(--metal-500)]"></div>
            </div>
        </div>
    );
};
