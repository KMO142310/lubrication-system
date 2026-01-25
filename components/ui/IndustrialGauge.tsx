'use client';

import React from 'react';

interface IndustrialGaugeProps {
    value: number;
    min?: number;
    max?: number;
    label: string;
    units?: string;
    size?: 'sm' | 'md' | 'lg';
    lowThreshold?: number;
    highThreshold?: number;
    className?: string;
}

export const IndustrialGauge = ({
    value,
    min = 0,
    max = 100,
    label,
    units = '',
    size = 'md',
    lowThreshold = 30, // Default Warning zone
    highThreshold = 80, // Default Good/Critical split
    className = ''
}: IndustrialGaugeProps) => {
    // Normalize value to 0-1 range
    const normalizedValue = Math.min(Math.max((value - min) / (max - min), 0), 1);

    // Sizing
    const sizeMap = {
        sm: { width: 100, stroke: 8, fontSize: 16 },
        md: { width: 160, stroke: 12, fontSize: 24 },
        lg: { width: 220, stroke: 16, fontSize: 32 }
    };

    const { width, stroke, fontSize } = sizeMap[size];
    const radius = (width - stroke) / 2;
    const center = width / 2;
    const circumference = Math.PI * radius;
    const strokeDashoffset = circumference * (1 - normalizedValue);

    // Determine color based on value logic
    // Typically: 0-low (bad/low), low-high (ok), high (bad/high) - OR - 
    // For compliance: low is bad, high is good.
    // Let's assume standard "Compliance" logic: < 80 is warning, < 50 is bad. 
    // BUT the prop naming suggests 0..low..high..100.
    // Let's stick to simple "Zone" logic:
    // Red < lowThreshold < Yellow < highThreshold < Green

    let strokeColor = 'var(--ansi-green)';
    if (value < lowThreshold) strokeColor = 'var(--ansi-red)';
    else if (value < highThreshold) strokeColor = 'var(--ansi-yellow)';
    else strokeColor = 'var(--ansi-green)';

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div className="relative" style={{ width, height: width / 2 + 10 }}>
                <svg
                    width={width}
                    height={width / 2 + stroke}
                    viewBox={`0 0 ${width} ${width / 2 + stroke}`}
                    className="overflow-visible"
                >
                    {/* Background Arc */}
                    <path
                        d={`M ${stroke / 2} ${center} A ${radius} ${radius} 0 0 1 ${width - stroke / 2} ${center}`}
                        fill="none"
                        stroke="var(--metal-700)"
                        strokeWidth={stroke}
                        strokeLinecap="butt"
                    />

                    {/* Value Arc */}
                    <path
                        d={`M ${stroke / 2} ${center} A ${radius} ${radius} 0 0 1 ${width - stroke / 2} ${center}`}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="butt"
                        className="transition-all duration-1000 ease-out"
                        filter="drop-shadow(0 0 2px rgba(0,0,0,0.5))"
                    />
                </svg>

                {/* Value Text */}
                <div
                    className="absolute bottom-0 left-0 right-0 text-center flex flex-col items-center justify-end"
                    style={{ height: '100%' }}
                >
                    <span
                        className="font-mono font-bold leading-none text-[var(--text-highlight)]"
                        style={{ fontSize, textShadow: `0 0 10px ${strokeColor}` }}
                    >
                        {value}
                        {units && <span className="text-[0.5em] ml-1 text-[var(--text-secondary)]">{units}</span>}
                    </span>
                </div>
            </div>

            {/* Label */}
            <h4 className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest mt-1">
                {label}
            </h4>
        </div>
    );
};
