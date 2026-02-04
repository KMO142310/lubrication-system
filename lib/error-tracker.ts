// AISA Internal Error Tracking
// Ligero y sin dependencias externas

interface ErrorEvent {
    id: string;
    timestamp: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    stack?: string;
    context?: Record<string, unknown>;
    url?: string;
    userAgent?: string;
}

const ERROR_LOG_KEY = 'aisa_error_log';
const MAX_ERRORS = 50;

// Generate UUID
function generateId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get stored errors
function getErrors(): ErrorEvent[] {
    try {
        return JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');
    } catch {
        return [];
    }
}

// Save error to localStorage
function saveError(error: ErrorEvent): void {
    const errors = getErrors();
    errors.unshift(error);

    // Keep only last MAX_ERRORS
    if (errors.length > MAX_ERRORS) {
        errors.length = MAX_ERRORS;
    }

    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(errors));
}

// Capture error
export function captureError(error: Error, context?: Record<string, unknown>): void {
    const event: ErrorEvent = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        type: 'error',
        message: error.message,
        stack: error.stack,
        context,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    saveError(event);

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
        console.error('[ErrorTracker]', error, context);
    }
}

// Capture message
export function captureMessage(message: string, type: 'warning' | 'info' = 'info', context?: Record<string, unknown>): void {
    const event: ErrorEvent = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        type,
        message,
        context,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    saveError(event);
}

// Add user context
let userContext: Record<string, unknown> = {};
export function setUser(user: { id: string; email?: string; role?: string }): void {
    userContext = user;
}

// Wrap async function with error tracking
export function withErrorTracking<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    context?: Record<string, unknown>
): T {
    return (async (...args: Parameters<T>) => {
        try {
            return await fn(...args);
        } catch (error) {
            captureError(error as Error, { ...context, ...userContext, args });
            throw error;
        }
    }) as T;
}

// Global error handler setup
export function setupGlobalErrorHandler(): void {
    if (typeof window === 'undefined') return;

    // Unhandled errors
    window.addEventListener('error', (event) => {
        captureError(event.error || new Error(event.message), {
            type: 'unhandled',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
        });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        captureError(
            event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
            { type: 'unhandledrejection' }
        );
    });

    console.log('[ErrorTracker] Global handler initialized');
}

// Get error report for debugging
export function getErrorReport(): { errors: ErrorEvent[]; summary: { total: number; byType: Record<string, number> } } {
    const errors = getErrors();
    const byType: Record<string, number> = {};

    errors.forEach((e) => {
        byType[e.type] = (byType[e.type] || 0) + 1;
    });

    return {
        errors,
        summary: {
            total: errors.length,
            byType,
        },
    };
}

// Clear error log
export function clearErrors(): void {
    localStorage.removeItem(ERROR_LOG_KEY);
}

// Send errors to server (when online)
export async function flushErrors(endpoint?: string): Promise<boolean> {
    if (!endpoint) {
        console.log('[ErrorTracker] No endpoint configured');
        return false;
    }

    const errors = getErrors();
    if (errors.length === 0) return true;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ errors, sentAt: new Date().toISOString() }),
        });

        if (response.ok) {
            clearErrors();
            return true;
        }
    } catch (error) {
        console.error('[ErrorTracker] Failed to flush:', error);
    }

    return false;
}
