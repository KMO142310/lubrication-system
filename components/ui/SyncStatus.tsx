import React, { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { dbLocal } from '@/lib/db/offline';
import { processSyncQueue } from '@/lib/sync-engine';

export function SyncStatusIndicator() {
    const pendingCount = useLiveQuery(() => dbLocal.syncQueue.count()) || 0;
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    // Intentar sincronizar periódicamente si hay pendientes
    useEffect(() => {
        const interval = setInterval(() => {
            if (pendingCount > 0 && navigator.onLine) {
                processSyncQueue();
            }
        }, 30000); // Cada 30 seg
        return () => clearInterval(interval);
    }, [pendingCount]);

    if (pendingCount === 0) {
        return (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Sincronizado
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium border border-yellow-200 shadow-sm transition-all">
            {isOnline ? (
                <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-spin"></span>
                    Sincronizando ({pendingCount})...
                </>
            ) : (
                <>
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Offline ({pendingCount} pendientes)
                </>
            )}
        </div>
    );
}
