// Data Service mock type for analytics to access raw data if needed
// In real app, we pass data as arguments
import { Task, WorkOrder, Machine, Frequency } from './types';

export function calculateCompliance(completedCount: number, totalCount: number): number {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
}

interface TaskWithStatus {
    status: string;
    quantityUsed?: number;
    [key: string]: unknown;
}

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

/**
 * RISK MANAGEMENT MODULE
 */

interface RiskContext {
    overdueTasks: (Task & { workOrderDate: string; machineCriticality?: string; toleranceDays?: number })[];
}

export function calculateSystemRisk(context: RiskContext) {
    let riskScore = 0;
    let criticalCount = 0;

    context.overdueTasks.forEach(task => {
        const daysLate = Math.floor((new Date().getTime() - new Date(task.workOrderDate).getTime()) / (1000 * 3600 * 24));
        const tolerance = task.toleranceDays || 1;

        let multiplier = 1;
        if (task.machineCriticality === 'A') multiplier = 10;
        if (task.machineCriticality === 'B') multiplier = 5;
        if (task.machineCriticality === 'C') multiplier = 1;

        if (daysLate > tolerance) {
            riskScore += (daysLate - tolerance) * multiplier;
            if (task.machineCriticality === 'A') criticalCount++;
        }
    });

    // Normalize score (0-100 scale logic could be applied here, but raw score works for now)
    return {
        score: riskScore,
        level: riskScore > 50 ? 'CRITICAL' : riskScore > 20 ? 'HIGH' : riskScore > 0 ? 'MODERATE' : 'LOW',
        criticalCount
    };
}

/**
 * FINANCIAL INTELLIGENCE MODULE
 */

interface CostContext {
    completedTasks: (Task & {
        quantityUsed?: number;
        lubricantPrice?: number;
        lubricantCurrency?: 'CLP' | 'USD';
    })[];
}

export function calculateOperatingCosts(context: CostContext) {
    let totalCostCLP = 0;

    // Simple exchange rate mock - in production this should be dynamic or stored
    const USD_TO_CLP = 950;

    context.completedTasks.forEach(task => {
        if (!task.quantityUsed || !task.lubricantPrice) return;

        let cost = task.quantityUsed * task.lubricantPrice;

        // Normalize unit: prices are usually per L or Kg, usage is often in ml or g
        // Assumption: Price is per Unit (L/Kg), Usage is in base unit (ml/g) -> Divide by 1000
        cost = cost / 1000;

        if (task.lubricantCurrency === 'USD') {
            cost = cost * USD_TO_CLP;
        }

        totalCostCLP += cost;
    });

    return {
        totalCLP: Math.round(totalCostCLP),
        formatted: new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalCostCLP)
    };
}
