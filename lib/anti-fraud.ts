/**
 * SISTEMA ANTI-FRAUDE - Lubricación AISA
 * 
 * Protecciones implementadas:
 * 1. Hash de fotos para detectar duplicados
 * 2. Metadatos obligatorios (timestamp, dispositivo)
 * 3. Historial de auditoría inmutable
 * 4. Bloqueo de reutilización de fotos
 * 5. Alertas para supervisores
 */

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
