'use client';

import { useEffect, useRef } from 'react';
import { syncPendingQueue, isOnline } from '@/lib/sync';
import toast from 'react-hot-toast';

/**
 * SyncManager - Componente de sincronización automática
 * 
 * Funcionalidades:
 * - Sincroniza cola pendiente cuando hay conexión
 * - Detecta cambios online/offline
 * - Notifica al usuario del estado de sync
 */
export function SyncManager() {
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    // Función de sincronización
    const performSync = async () => {
      if (!isOnline()) {
        wasOfflineRef.current = true;
        return;
      }

      // Si estábamos offline y ahora online, notificar
      if (wasOfflineRef.current) {
        toast.success('🌐 Conexión restaurada', { duration: 2000 });
        wasOfflineRef.current = false;
      }

      try {
        const result = await syncPendingQueue();
        if (result.synced > 0) {
          toast.success(`✅ ${result.synced} tarea(s) sincronizada(s)`, { duration: 3000 });
        }
      } catch (error) {
        console.error('Error en sync automático:', error);
      }
    };

    // Sync inicial
    performSync();

    // Sync cada 30 segundos
    syncIntervalRef.current = setInterval(performSync, 30000);

    // Detectar cambios de conexión
    const handleOnline = () => {
      toast.success('🌐 Conexión restaurada', { duration: 2000 });
      performSync();
    };

    const handleOffline = () => {
      toast.error('📴 Sin conexión - Modo offline', { duration: 3000 });
      wasOfflineRef.current = true;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Este componente no renderiza nada visible
  return null;
}
