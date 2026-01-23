'use client';

import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/components/ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ToastProvider />
            {children}
        </AuthProvider>
    );
}
