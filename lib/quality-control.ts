/**
 * AISA Quality Control System
 * Validaciones de negocio para evitar errores operativos humanos.
 */

interface ValidationResult {
    valid: boolean;
    error?: string;
    warning?: string;
}

export function validateTaskExecution(
    enteredQuantity: number,
    expectedQuantity: number,
    unit: string
): ValidationResult {
    // 1. Sanity Check: Valores negativos o cero (si se espera algo)
    if (enteredQuantity < 0) {
        return { valid: false, error: 'La cantidad no puede ser negativa.' };
    }
    if (expectedQuantity > 0 && enteredQuantity === 0) {
        return { valid: false, warning: 'Se reportó cantidad 0. ¿Se realizó la tarea?' };
    }

    // 2. Unit Sanity Check (Evitar confusión Kg vs g)
    // Si la unidad es gramos/ml y el valor es muy bajo (< 1) o muy alto (> 5000)
    if ((unit === 'g' || unit === 'ml') && enteredQuantity > 5000) {
        return { valid: false, error: `Cantidad sospechosamente alta (${enteredQuantity} ${unit}). ¿Quizás quisiste decir ${enteredQuantity / 1000} kg/L?` };
    }

    // 3. Deviation Check (Tolerancia del 50%)
    const deviation = Math.abs(enteredQuantity - expectedQuantity);
    const percentage = expectedQuantity > 0 ? (deviation / expectedQuantity) : 0;

    if (percentage > 0.5) {
        return {
            valid: false,
            error: `La cantidad desviada es excesiva (>50%). Esperado: ${expectedQuantity} ${unit}. Intentado: ${enteredQuantity} ${unit}.`
        };
    }

    if (percentage > 0.2) {
        return {
            valid: true,
            warning: `Desviación considerable (>20%). Esperado: ${expectedQuantity}.`
        };
    }

    return { valid: true };
}
