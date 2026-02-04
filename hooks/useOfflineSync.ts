'use client';

import { useEffect, useState, useCallback } from 'react';

interface SyncStatus {
    isOnline: boolean;
    isRegistered: boolean;
    pendingSync: number;
    lastSync: Date | null;
}

export function useOfflineSync() {
    const [status, setStatus] = useState<SyncStatus>({
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        isRegistered: false,
        pendingSync: 0,
        lastSync: null,
    });

    // Track online/offline
    useEffect(() => {
        const handleOnline = () => {
            setStatus(prev => ({ ...prev, isOnline: true }));
            // Trigger sync when back online
            triggerSync();
        };

        const handleOffline = () => {
            setStatus(prev => ({ ...prev, isOnline: false }));
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Listen for SW messages
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'SYNC_COMPLETE') {
                setStatus(prev => ({
                    ...prev,
                    pendingSync: 0,
                    lastSync: new Date(event.data.timestamp),
                }));
            }
        };

        navigator.serviceWorker?.addEventListener('message', handleMessage);
        return () => {
            navigator.serviceWorker?.removeEventListener('message', handleMessage);
        };
    }, []);

    // Register SW
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('[App] SW registered:', registration.scope);
                    setStatus(prev => ({ ...prev, isRegistered: true }));

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        console.log('[App] SW update found');
                    });
                })
                .catch((error) => {
                    console.error('[App] SW registration failed:', error);
                });
        }
    }, []);

    // Trigger background sync
    const triggerSync = useCallback(async () => {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                // @ts-expect-error - sync is not fully typed in TS
                await registration.sync.register('sync-completed-tasks');
                console.log('[App] Background sync registered');
            } catch (error) {
                console.log('[App] Background sync not supported:', error);
            }
        }
    }, []);

    // Queue an item for sync
    const queueForSync = useCallback((item: { type: string; data: unknown }) => {
        // Store in localStorage for sync later
        const queue = JSON.parse(localStorage.getItem('aisa_sync_queue') || '[]');
        queue.push({ ...item, timestamp: Date.now() });
        localStorage.setItem('aisa_sync_queue', JSON.stringify(queue));

        setStatus(prev => ({ ...prev, pendingSync: queue.length }));

        // Try to sync immediately if online
        if (navigator.onLine) {
            triggerSync();
        }
    }, [triggerSync]);

    // Request notification permission
    const requestNotifications = useCallback(async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }, []);

    // Subscribe to push notifications
    const subscribeToPush = useCallback(async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    // This would come from your server
                    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                });
                console.log('[App] Push subscription:', subscription);
                return subscription;
            } catch (error) {
                console.error('[App] Push subscription failed:', error);
            }
        }
        return null;
    }, []);

    return {
        ...status,
        triggerSync,
        queueForSync,
        requestNotifications,
        subscribeToPush,
    };
}

// Hook para mostrar prompt de instalación PWA
export function usePWAInstall() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setInstallPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        if (!installPrompt) return false;

        installPrompt.prompt();
        const result = await installPrompt.userChoice;

        if (result.outcome === 'accepted') {
            setInstallPrompt(null);
            return true;
        }
        return false;
    }, [installPrompt]);

    return {
        canInstall: !!installPrompt,
        isInstalled,
        promptInstall,
    };
}

// Type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
