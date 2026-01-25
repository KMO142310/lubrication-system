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



// ============================================================
// VALIDACIONES DE SEGURIDAD
// ============================================================



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
 * Calcula distancia entre dos puntos (Haversine)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}



// ============================================================
// HORARIO LABORAL
// ============================================================



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
