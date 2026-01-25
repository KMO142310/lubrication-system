export interface SyncStatus {
    isOnline: boolean;
    lastSync: Date | null;
    isSyncing: boolean;
}

const currentSyncStatus: SyncStatus = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastSync: null,
    isSyncing: false,
};

const syncStatusListeners: ((status: SyncStatus) => void)[] = [];

export function getSyncStatus(): SyncStatus {
    return currentSyncStatus;
}

export function onSyncStatusChange(listener: (status: SyncStatus) => void): () => void {
    syncStatusListeners.push(listener);
    return () => {
        const index = syncStatusListeners.indexOf(listener);
        if (index > -1) syncStatusListeners.splice(index, 1);
    };
}

export function notifyListeners() {
    syncStatusListeners.forEach(listener => listener(currentSyncStatus));
}

// Allow external updates
export function updateSyncStatus(updates: Partial<SyncStatus>) {
    Object.assign(currentSyncStatus, updates);
    notifyListeners();
}
