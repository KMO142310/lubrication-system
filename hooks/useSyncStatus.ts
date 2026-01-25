/**
 * useSyncStatus Hook
 * React hook for Supabase sync status
 */

import { useState, useEffect } from 'react';
import { subscribeSyncStatus, getSyncStatus, startConnectivityMonitor } from '@/lib/supabase-sync';

export type SyncStatus = 'idle' | 'syncing' | 'online' | 'offline' | 'error';

export function useSyncStatus() {
    const [status, setStatus] = useState<SyncStatus>(getSyncStatus());

    useEffect(() => {
        // Subscribe to sync status changes
        const unsubscribe = subscribeSyncStatus(setStatus);

        // Start connectivity monitor
        const stopMonitor = startConnectivityMonitor();

        return () => {
            unsubscribe();
            stopMonitor();
        };
    }, []);

    return {
        status,
        isOnline: status === 'online',
        isOffline: status === 'offline',
        isSyncing: status === 'syncing',
        hasError: status === 'error'
    };
}
