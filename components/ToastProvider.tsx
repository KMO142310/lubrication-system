'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'var(--surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-inter)',
                },
                success: {
                    iconTheme: {
                        primary: 'var(--success-500)',
                        secondary: 'white',
                    },
                },
                error: {
                    iconTheme: {
                        primary: 'var(--accent-500)',
                        secondary: 'white',
                    },
                },
            }}
        />
    );
}
