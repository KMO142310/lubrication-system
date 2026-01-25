/**
 * Librería de analíticas y cálculos de negocio
 * Centraliza la lógica matemática de reportes para evitar duplicidad
 */

/**
 * Calcula el porcentaje de cumplimiento
 */
export function calculateCompliance(completedCount: number, totalCount: number): number {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
}

/**
 * Interfaz genérica para tareas que tienen un campo status
 */
interface TaskWithStatus {
    status: string;
    quantityUsed?: number;
    [key: string]: any;
}

/**
 * Genera estadísticas básicas de un conjunto de tareas
 */
export function getTaskStats(tasks: TaskWithStatus[]) {
    const completed = tasks.filter(t => t.status === 'completado');
    const pending = tasks.filter(t => t.status === 'pendiente');
    const skipped = tasks.filter(t => t.status === 'omitido');

    return {
        completed,
        pending,
        skipped,
        counts: {
            total: tasks.length,
            completed: completed.length,
            pending: pending.length,
            skipped: skipped.length,
        },
        totalLubricantUsed: completed.reduce((acc, t) => acc + (t.quantityUsed || 0), 0)
    };
}
