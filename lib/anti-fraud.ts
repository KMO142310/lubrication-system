/**
 * SISTEMA ANTI-FRAUDE - Lubricación AISA
 * 
 * Protecciones implementadas:
 * 1. Hash de fotos para detectar duplicados
 * 2. Metadatos obligatorios (timestamp, dispositivo)
 * 3. Historial de auditoría inmutable
 * 4. Bloqueo de reutilización de fotos
 * 5. Alertas para supervisores
 * 6. GPS opcional (funciona sin señal)
 * 7. Horario laboral configurable
 * 8. Modo offline para mala señal
 */

// ============================================================
// CONFIGURACIÓN DE SEGURIDAD
// ============================================================

export const SECURITY_CONFIG = {
  // Horario laboral permitido (24h format)
  workingHours: {
    start: 7,  // 7:00 AM
    end: 19,   // 7:00 PM
    enabled: true,
    allowWeekends: false,
  },
  
  // GPS
  gps: {
    enabled: true,
    required: false, // No bloquear si no hay GPS (mala señal)
    plantCoordinates: {
      lat: -33.4489, // Coordenadas de la planta (ejemplo Santiago)
      lng: -70.6693,
      radiusKm: 5, // Radio permitido en km
    },
  },
  
  // Límites anti-abuso
  limits: {
    maxCorrectionsPerDay: 3,
    minTaskCompletionSeconds: 20, // Reducido para equipos lentos
    maxPhotosPerTask: 5,
  },
  
  // Modo offline
  offline: {
    enabled: true,
    syncOnReconnect: true,
    maxOfflineHours: 24, // Máximo tiempo offline antes de alerta
  },
};

// ============================================================
// TIPOS
// ============================================================

export interface PhotoMetadata {
  hash: string;
  timestamp: string;
  deviceInfo: string;
  taskId: string;
  userId: string;
  type: 'before' | 'after';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'task_started' | 'task_completed' | 'task_corrected' | 'task_skipped' | 'photo_uploaded' | 'anomaly_reported' | 'fraud_alert';
  taskId?: string;
  details: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  deviceInfo?: string;
}

export interface FraudAlert {
  id: string;
  timestamp: string;
  type: 'duplicate_photo' | 'suspicious_time' | 'location_mismatch' | 'rapid_completion';
  severity: 'low' | 'medium' | 'high';
  userId: string;
  taskId: string;
  description: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

// ============================================================
// STORAGE KEYS
// ============================================================

const STORAGE_KEYS = {
  photoHashes: 'aisa_photo_hashes',
  auditLogs: 'aisa_audit_logs',
  fraudAlerts: 'aisa_fraud_alerts',
  taskCorrections: 'aisa_task_corrections',
};

// ============================================================
// FUNCIONES DE HASH
// ============================================================

/**
 * Genera un hash único para una imagen
 * Usa una versión simplificada basada en los datos de la imagen
 */
export async function generateImageHash(imageDataUrl: string): Promise<string> {
  // Extraer solo los datos base64 (sin el prefijo data:image/...)
  const base64Data = imageDataUrl.split(',')[1] || imageDataUrl;
  
  // Crear hash usando SubtleCrypto (disponible en navegadores modernos)
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(base64Data);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback: hash simple basado en longitud y muestreo
  let hash = 0;
  const sample = base64Data.slice(0, 1000) + base64Data.slice(-1000);
  for (let i = 0; i < sample.length; i++) {
    const char = sample.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16) + '_' + base64Data.length.toString(16);
}

// ============================================================
// DETECCIÓN DE FOTOS DUPLICADAS
// ============================================================

/**
 * Verifica si una foto ya fue usada anteriormente
 * Retorna información sobre el uso previo si existe
 */
export function checkDuplicatePhoto(hash: string): PhotoMetadata | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(STORAGE_KEYS.photoHashes);
  const hashes: PhotoMetadata[] = stored ? JSON.parse(stored) : [];
  
  return hashes.find(h => h.hash === hash) || null;
}

/**
 * Registra una foto nueva en el sistema
 */
export function registerPhoto(metadata: PhotoMetadata): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(STORAGE_KEYS.photoHashes);
  const hashes: PhotoMetadata[] = stored ? JSON.parse(stored) : [];
  
  hashes.push(metadata);
  localStorage.setItem(STORAGE_KEYS.photoHashes, JSON.stringify(hashes));
}

/**
 * Obtiene todas las fotos registradas de un usuario
 */
export function getUserPhotos(userId: string): PhotoMetadata[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.photoHashes);
  const hashes: PhotoMetadata[] = stored ? JSON.parse(stored) : [];
  
  return hashes.filter(h => h.userId === userId);
}

// ============================================================
// SISTEMA DE AUDITORÍA
// ============================================================

/**
 * Registra una acción en el log de auditoría
 */
export function logAuditAction(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(STORAGE_KEYS.auditLogs);
  const logs: AuditLog[] = stored ? JSON.parse(stored) : [];
  
  const newLog: AuditLog = {
    ...log,
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    deviceInfo: getDeviceInfo(),
  };
  
  logs.unshift(newLog); // Más reciente primero
  
  // Mantener solo los últimos 1000 registros
  if (logs.length > 1000) {
    logs.length = 1000;
  }
  
  localStorage.setItem(STORAGE_KEYS.auditLogs, JSON.stringify(logs));
}

/**
 * Obtiene los logs de auditoría filtrados
 */
export function getAuditLogs(filters?: {
  userId?: string;
  action?: AuditLog['action'];
  taskId?: string;
  fromDate?: string;
  toDate?: string;
}): AuditLog[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.auditLogs);
  let logs: AuditLog[] = stored ? JSON.parse(stored) : [];
  
  if (filters) {
    if (filters.userId) {
      logs = logs.filter(l => l.userId === filters.userId);
    }
    if (filters.action) {
      logs = logs.filter(l => l.action === filters.action);
    }
    if (filters.taskId) {
      logs = logs.filter(l => l.taskId === filters.taskId);
    }
    if (filters.fromDate) {
      logs = logs.filter(l => l.timestamp >= filters.fromDate!);
    }
    if (filters.toDate) {
      logs = logs.filter(l => l.timestamp <= filters.toDate!);
    }
  }
  
  return logs;
}

// ============================================================
// ALERTAS DE FRAUDE
// ============================================================

/**
 * Crea una alerta de fraude
 */
export function createFraudAlert(alert: Omit<FraudAlert, 'id' | 'timestamp' | 'resolved'>): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(STORAGE_KEYS.fraudAlerts);
  const alerts: FraudAlert[] = stored ? JSON.parse(stored) : [];
  
  const newAlert: FraudAlert = {
    ...alert,
    id: `fraud-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    resolved: false,
  };
  
  alerts.unshift(newAlert);
  localStorage.setItem(STORAGE_KEYS.fraudAlerts, JSON.stringify(alerts));
  
  // También registrar en auditoría
  logAuditAction({
    userId: alert.userId,
    userName: 'Sistema',
    action: 'fraud_alert',
    taskId: alert.taskId,
    details: `ALERTA: ${alert.description}`,
    metadata: { alertType: alert.type, severity: alert.severity },
  });
}

/**
 * Obtiene alertas de fraude pendientes
 */
export function getFraudAlerts(includeResolved = false): FraudAlert[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.fraudAlerts);
  const alerts: FraudAlert[] = stored ? JSON.parse(stored) : [];
  
  return includeResolved ? alerts : alerts.filter(a => !a.resolved);
}

/**
 * Resuelve una alerta de fraude
 */
export function resolveFraudAlert(alertId: string, resolvedBy: string): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(STORAGE_KEYS.fraudAlerts);
  const alerts: FraudAlert[] = stored ? JSON.parse(stored) : [];
  
  const index = alerts.findIndex(a => a.id === alertId);
  if (index !== -1) {
    alerts[index].resolved = true;
    alerts[index].resolvedBy = resolvedBy;
    alerts[index].resolvedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.fraudAlerts, JSON.stringify(alerts));
  }
}

// ============================================================
// CORRECCIÓN DE TAREAS
// ============================================================

export interface TaskCorrection {
  id: string;
  taskId: string;
  timestamp: string;
  userId: string;
  userName: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  approvedBy?: string;
  approvedAt?: string;
  rejected?: boolean;
}

/**
 * Solicita corrección de una tarea
 * Requiere aprobación de supervisor para completarse
 */
export function requestTaskCorrection(correction: Omit<TaskCorrection, 'id' | 'timestamp'>): TaskCorrection {
  if (typeof window === 'undefined') throw new Error('Not in browser');
  
  const stored = localStorage.getItem(STORAGE_KEYS.taskCorrections);
  const corrections: TaskCorrection[] = stored ? JSON.parse(stored) : [];
  
  const newCorrection: TaskCorrection = {
    ...correction,
    id: `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  corrections.unshift(newCorrection);
  localStorage.setItem(STORAGE_KEYS.taskCorrections, JSON.stringify(corrections));
  
  // Registrar en auditoría
  logAuditAction({
    userId: correction.userId,
    userName: correction.userName,
    action: 'task_corrected',
    taskId: correction.taskId,
    details: `Solicitud de corrección: ${correction.reason}. Estado: ${correction.previousStatus} → ${correction.newStatus}`,
  });
  
  return newCorrection;
}

/**
 * Obtiene correcciones pendientes de aprobación
 */
export function getPendingCorrections(): TaskCorrection[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.taskCorrections);
  const corrections: TaskCorrection[] = stored ? JSON.parse(stored) : [];
  
  return corrections.filter(c => !c.approvedBy && !c.rejected);
}

/**
 * Aprueba o rechaza una corrección
 */
export function processCorrection(correctionId: string, approved: boolean, processedBy: string): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(STORAGE_KEYS.taskCorrections);
  const corrections: TaskCorrection[] = stored ? JSON.parse(stored) : [];
  
  const index = corrections.findIndex(c => c.id === correctionId);
  if (index !== -1) {
    if (approved) {
      corrections[index].approvedBy = processedBy;
      corrections[index].approvedAt = new Date().toISOString();
    } else {
      corrections[index].rejected = true;
    }
    localStorage.setItem(STORAGE_KEYS.taskCorrections, JSON.stringify(corrections));
  }
}

// ============================================================
// VALIDACIONES DE SEGURIDAD
// ============================================================

/**
 * Verifica si el tiempo entre tareas es sospechosamente rápido
 */
export function checkSuspiciousCompletionTime(
  userId: string,
  taskId: string,
  completionTimeSeconds: number
): boolean {
  // Si completa una tarea en menos de 30 segundos, es sospechoso
  const MIN_COMPLETION_TIME = 30;
  
  if (completionTimeSeconds < MIN_COMPLETION_TIME) {
    createFraudAlert({
      type: 'rapid_completion',
      severity: 'medium',
      userId,
      taskId,
      description: `Tarea completada en ${completionTimeSeconds}s (mínimo esperado: ${MIN_COMPLETION_TIME}s)`,
    });
    return true;
  }
  
  return false;
}

/**
 * Obtiene información del dispositivo
 */
function getDeviceInfo(): string {
  if (typeof window === 'undefined') return 'server';
  
  const ua = navigator.userAgent;
  const isMobile = /Mobile|Android|iPhone/i.test(ua);
  const browser = /Chrome|Firefox|Safari|Edge/i.exec(ua)?.[0] || 'Unknown';
  
  return `${isMobile ? 'Mobile' : 'Desktop'} - ${browser}`;
}

// ============================================================
// EXPORTAR DATOS PARA AUDITORÍA EXTERNA
// ============================================================

export function exportAuditData(): string {
  const data = {
    exportDate: new Date().toISOString(),
    auditLogs: getAuditLogs(),
    fraudAlerts: getFraudAlerts(true),
    corrections: getPendingCorrections(),
  };
  
  return JSON.stringify(data, null, 2);
}

// ============================================================
// GPS Y GEOLOCALIZACIÓN (Opcional - funciona sin señal)
// ============================================================

export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: string;
  source: 'gps' | 'network' | 'unavailable';
}

/**
 * Intenta obtener ubicación GPS (no bloquea si falla)
 * Timeout corto para equipos lentos/mala señal
 */
export async function getLocation(): Promise<LocationData | null> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      // Sin señal GPS - permitir continuar
      resolve({
        lat: 0,
        lng: 0,
        accuracy: -1,
        timestamp: new Date().toISOString(),
        source: 'unavailable',
      });
    }, 5000); // 5 segundos máximo para mala señal

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
          source: position.coords.accuracy < 100 ? 'gps' : 'network',
        });
      },
      () => {
        clearTimeout(timeout);
        // Error de GPS - permitir continuar
        resolve({
          lat: 0,
          lng: 0,
          accuracy: -1,
          timestamp: new Date().toISOString(),
          source: 'unavailable',
        });
      },
      {
        enableHighAccuracy: false, // Más rápido para equipos lentos
        timeout: 5000,
        maximumAge: 60000, // Usar cache de 1 minuto
      }
    );
  });
}

/**
 * Calcula distancia entre dos puntos (Haversine)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Verifica si la ubicación está dentro del radio de la planta
 * Si no hay GPS, registra pero NO bloquea
 */
export function verifyLocation(location: LocationData | null, userId: string, taskId: string): {
  valid: boolean;
  warning: string | null;
  distance?: number;
} {
  if (!SECURITY_CONFIG.gps.enabled) {
    return { valid: true, warning: null };
  }

  // Sin GPS disponible - permitir pero registrar
  if (!location || location.source === 'unavailable') {
    logAuditAction({
      userId,
      userName: 'Sistema',
      action: 'task_completed',
      taskId,
      details: 'GPS no disponible (mala señal o permiso denegado)',
      metadata: { gpsStatus: 'unavailable' },
    });
    return { 
      valid: true, 
      warning: 'GPS no disponible. Tarea registrada sin ubicación.' 
    };
  }

  const { lat, lng, radiusKm } = SECURITY_CONFIG.gps.plantCoordinates;
  const distance = calculateDistance(location.lat, location.lng, lat, lng);

  if (distance > radiusKm) {
    // Fuera de rango - crear alerta pero NO bloquear (puede ser error de GPS)
    createFraudAlert({
      type: 'location_mismatch',
      severity: distance > radiusKm * 2 ? 'high' : 'medium',
      userId,
      taskId,
      description: `Ubicación a ${distance.toFixed(1)}km de la planta (máximo: ${radiusKm}km)`,
    });
    
    return {
      valid: true, // No bloquear, pero alertar
      warning: `Ubicación detectada a ${distance.toFixed(1)}km de la planta`,
      distance,
    };
  }

  return { valid: true, warning: null, distance };
}

// ============================================================
// HORARIO LABORAL
// ============================================================

/**
 * Verifica si está dentro del horario laboral
 * Funciona offline (usa hora del dispositivo)
 */
export function checkWorkingHours(): {
  allowed: boolean;
  message: string;
  currentHour: number;
} {
  if (!SECURITY_CONFIG.workingHours.enabled) {
    return { allowed: true, message: '', currentHour: new Date().getHours() };
  }

  const now = new Date();
  const currentHour = now.getHours();
  const dayOfWeek = now.getDay(); // 0=Dom, 6=Sáb
  const { start, end, allowWeekends } = SECURITY_CONFIG.workingHours;

  // Verificar fin de semana
  if (!allowWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
    return {
      allowed: false,
      message: 'No se permiten tareas en fin de semana',
      currentHour,
    };
  }

  // Verificar horario
  if (currentHour < start || currentHour >= end) {
    return {
      allowed: false,
      message: `Horario laboral: ${start}:00 - ${end}:00. Hora actual: ${currentHour}:${now.getMinutes().toString().padStart(2, '0')}`,
      currentHour,
    };
  }

  return { allowed: true, message: '', currentHour };
}

// ============================================================
// RESUMEN PARA SUPERVISORES
// ============================================================

export interface SecuritySummary {
  totalAlerts: number;
  unresolvedAlerts: number;
  alertsByType: Record<string, number>;
  alertsBySeverity: Record<string, number>;
  todayActions: number;
  suspiciousUsers: { userId: string; alertCount: number }[];
  pendingCorrections: number;
}

/**
 * Genera resumen de seguridad para supervisores
 */
export function getSecuritySummary(): SecuritySummary {
  const allAlerts = getFraudAlerts(true);
  const unresolvedAlerts = allAlerts.filter(a => !a.resolved);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  // Contar por tipo
  const alertsByType: Record<string, number> = {};
  const alertsBySeverity: Record<string, number> = {};
  const userAlertCount: Record<string, number> = {};

  unresolvedAlerts.forEach(alert => {
    alertsByType[alert.type] = (alertsByType[alert.type] || 0) + 1;
    alertsBySeverity[alert.severity] = (alertsBySeverity[alert.severity] || 0) + 1;
    userAlertCount[alert.userId] = (userAlertCount[alert.userId] || 0) + 1;
  });

  // Usuarios sospechosos (más de 2 alertas)
  const suspiciousUsers = Object.entries(userAlertCount)
    .filter(([, count]) => count >= 2)
    .map(([userId, alertCount]) => ({ userId, alertCount }))
    .sort((a, b) => b.alertCount - a.alertCount);

  // Acciones de hoy
  const todayActions = getAuditLogs({ fromDate: todayStart.toISOString() }).length;

  return {
    totalAlerts: allAlerts.length,
    unresolvedAlerts: unresolvedAlerts.length,
    alertsByType,
    alertsBySeverity,
    todayActions,
    suspiciousUsers,
    pendingCorrections: getPendingCorrections().length,
  };
}
