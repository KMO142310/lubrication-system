/**
 * Enterprise Error Handling System
 * Centralized error management with logging and user-friendly messages
 */

// Error types for the application
export enum ErrorCode {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS = 'AUTH_001',
  AUTH_SESSION_EXPIRED = 'AUTH_002',
  AUTH_UNAUTHORIZED = 'AUTH_003',

  // Data errors
  DATA_NOT_FOUND = 'DATA_001',
  DATA_VALIDATION_FAILED = 'DATA_002',
  DATA_DUPLICATE = 'DATA_003',
  DATA_INTEGRITY_ERROR = 'DATA_004',

  // Network errors
  NETWORK_OFFLINE = 'NET_001',
  NETWORK_TIMEOUT = 'NET_002',
  NETWORK_SERVER_ERROR = 'NET_003',

  // Business logic errors
  TASK_ALREADY_COMPLETED = 'BIZ_001',
  TASK_NOT_ASSIGNED = 'BIZ_002',
  INSUFFICIENT_STOCK = 'BIZ_003',

  // System errors
  SYSTEM_UNKNOWN = 'SYS_001',
  SYSTEM_STORAGE_FULL = 'SYS_002',
}

// User-friendly error messages in Spanish
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Credenciales inválidas. Verifique su email y contraseña.',
  [ErrorCode.AUTH_SESSION_EXPIRED]: 'Su sesión ha expirado. Por favor inicie sesión nuevamente.',
  [ErrorCode.AUTH_UNAUTHORIZED]: 'No tiene permisos para realizar esta acción.',

  [ErrorCode.DATA_NOT_FOUND]: 'El recurso solicitado no fue encontrado.',
  [ErrorCode.DATA_VALIDATION_FAILED]: 'Los datos ingresados no son válidos.',
  [ErrorCode.DATA_DUPLICATE]: 'Ya existe un registro con estos datos.',
  [ErrorCode.DATA_INTEGRITY_ERROR]: 'Error de integridad de datos.',

  [ErrorCode.NETWORK_OFFLINE]: 'Sin conexión a internet. Verifique su conexión.',
  [ErrorCode.NETWORK_TIMEOUT]: 'La solicitud tardó demasiado. Intente nuevamente.',
  [ErrorCode.NETWORK_SERVER_ERROR]: 'Error en el servidor. Intente más tarde.',

  [ErrorCode.TASK_ALREADY_COMPLETED]: 'Esta tarea ya fue completada.',
  [ErrorCode.TASK_NOT_ASSIGNED]: 'Esta tarea no está asignada a usted.',
  [ErrorCode.INSUFFICIENT_STOCK]: 'Stock insuficiente de lubricante.',

  [ErrorCode.SYSTEM_UNKNOWN]: 'Ha ocurrido un error inesperado.',
  [ErrorCode.SYSTEM_STORAGE_FULL]: 'Almacenamiento local lleno.',
};

// Application Error class
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly userMessage: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    technicalMessage?: string,
    context?: Record<string, unknown>
  ) {
    super(technicalMessage || ERROR_MESSAGES[code]);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = ERROR_MESSAGES[code];
    this.timestamp = new Date();
    this.context = context;

    // Log error for debugging
    logError(this);
  }
}

// Error logging function
interface ErrorLog {
  timestamp: string;
  code: string;
  message: string;
  context?: Record<string, unknown>;
  stack?: string;
}

const ERROR_LOG_KEY = 'aisa_error_log';
const MAX_LOG_ENTRIES = 100;

export function logError(error: AppError | Error): void {
  if (typeof window === 'undefined') return;

  try {
    const logs: ErrorLog[] = JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');

    const entry: ErrorLog = {
      timestamp: new Date().toISOString(),
      code: error instanceof AppError ? error.code : 'UNKNOWN',
      message: error.message,
      context: error instanceof AppError ? error.context : undefined,
      stack: error.stack,
    };

    logs.unshift(entry);

    // Keep only last MAX_LOG_ENTRIES
    if (logs.length > MAX_LOG_ENTRIES) {
      logs.length = MAX_LOG_ENTRIES;
    }

    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(logs));

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[AppError]', entry);
    }
  } catch {
    // Silently fail if localStorage is full
    console.error('Failed to log error:', error);
  }
}

// Get error logs for debugging
export function getErrorLogs(): ErrorLog[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');
  } catch {
    return [];
  }
}

// Clear error logs
export function clearErrorLogs(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ERROR_LOG_KEY);
}

// Helper to handle async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  fallbackCode: ErrorCode = ErrorCode.SYSTEM_UNKNOWN
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (err) {
    if (err instanceof AppError) {
      return { data: null, error: err };
    }

    const error = new AppError(
      fallbackCode,
      err instanceof Error ? err.message : 'Unknown error',
      { originalError: err }
    );
    return { data: null, error };
  }
}

// Alias for refactoring plan compliance
export const safeExecute = withErrorHandling;

// Helper for sync operations
export function withErrorHandlingSync<T>(
  operation: () => T,
  fallbackCode: ErrorCode = ErrorCode.SYSTEM_UNKNOWN
): { data: T | null; error: AppError | null } {
  try {
    const data = operation();
    return { data, error: null };
  } catch (err) {
    if (err instanceof AppError) {
      return { data: null, error: err };
    }

    const error = new AppError(
      fallbackCode,
      err instanceof Error ? err.message : 'Unknown error',
      { originalError: err }
    );
    return { data: null, error };
  }
}

// Network error detection
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  if (error instanceof Error && error.message.includes('network')) {
    return true;
  }
  return !navigator.onLine;
}

// Create appropriate error from network response
export function createNetworkError(status: number, message?: string): AppError {
  if (status === 401 || status === 403) {
    return new AppError(ErrorCode.AUTH_UNAUTHORIZED, message);
  }
  if (status === 404) {
    return new AppError(ErrorCode.DATA_NOT_FOUND, message);
  }
  if (status >= 500) {
    return new AppError(ErrorCode.NETWORK_SERVER_ERROR, message);
  }
  return new AppError(ErrorCode.SYSTEM_UNKNOWN, message);
}
