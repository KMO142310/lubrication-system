"use client";

import { usePathname } from 'next/navigation';
import { SyncStatusIndicator } from '@/components/ui/SyncStatus';

export function GlobalStatusBar() {
    const pathname = usePathname();

    // No mostrar en login
    if (pathname === '/login') return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-end p-2 pointer-events-none">
            <div className="pointer-events-auto bg-white/90 backdrop-blur rounded-full shadow-lg">
                <SyncStatusIndicator />
            </div>
        </div>
    );
}
