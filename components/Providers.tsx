'use client';

import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/components/ToastProvider';
import { SyncManager } from '@/components/SyncManager';
import { OfflineStatusBar } from '@/components/OfflineStatusBar';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider />
            <SyncManager />
            <OfflineStatusBar />
            {children}
        </AuthProvider>
    );
}
