// ============================================================
// CALENDAR UTILITIES - Planificación Tareas AISA
// Sistema de turnos A/B según Manual AISA 2026
// ============================================================

import { PUNTOS_LUBRICACION, FRECUENCIAS } from './datos_completos_aisa';
import type { LubricationPoint } from './types';

// ============================================================
// SISTEMA DE TURNOS
// ============================================================

export type Turno = 'A' | 'B';

export interface TurnoConfig {
    turno: Turno;
    dias: string[]; // Días de trabajo
    descripcion: string;
}

export const TURNOS: Record<Turno, TurnoConfig> = {
    A: {
        turno: 'A',
        dias: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
        descripcion: 'Lunes a Viernes (Libra: Sáb-Dom-Lun)',
    },
    B: {
        turno: 'B',
        dias: ['martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        descripcion: 'Martes a Sábado (Libra: Domingo)',
    },
};

// Obtener el turno de una semana específica
export function getTurnoSemana(fecha: Date, turnoInicial: Turno = 'A'): Turno {
    // Semana 1 del año es el turno inicial
    const startOfYear = new Date(fecha.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
        ((fecha.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
    );

    // Alternar cada semana
    return weekNumber % 2 === 1 ? turnoInicial : (turnoInicial === 'A' ? 'B' : 'A');
}

// Verificar si es día de trabajo para un turno
export function esDiaTrabajo(fecha: Date, turno: Turno): boolean {
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diaSemana = dias[fecha.getDay()];
    return TURNOS[turno].dias.includes(diaSemana);
}

// ============================================================
// GENERADOR DE CALENDARIO
// ============================================================

export interface DiaCalendario {
    fecha: Date;
    esTrabajo: boolean;
    turno: Turno;
    tareas: LubricationPoint[];
    totalTareas: number;
}

export interface CalendarioMes {
    mes: number;
    año: number;
    nombreMes: string;
    dias: DiaCalendario[];
    totalTareas: number;
}

// Obtener tareas para una fecha específica
export function getTareasParaFecha(fecha: Date): LubricationPoint[] {
    const dayOfMonth = fecha.getDate();
    const dayOfWeek = fecha.getDay(); // 0=Dom, 6=Sáb
    const month = fecha.getMonth();

    return PUNTOS_LUBRICACION.filter(lp => {
        const freq = FRECUENCIAS.find(f => f.id === lp.frequencyId);
        if (!freq) return false;

        switch (lp.frequencyId) {
            case 'freq-8hrs': // Diario
                return true;

            case 'freq-dia-medio': // Día por medio
                return dayOfMonth % 2 === 1;

            case 'freq-40hrs': // Semanal (Lunes)
            case 'freq-semanal':
                return dayOfWeek === 1;

            case 'freq-160hrs': // Quincenal
                return dayOfMonth === 1 || dayOfMonth === 15;

            case 'freq-mensual': // Mensual (1er día)
                return dayOfMonth === 1;

            case 'freq-trimestral': // Trimestral
                return dayOfMonth === 1 && [0, 3, 6, 9].includes(month);

            case 'freq-semestral': // Semestral
                return dayOfMonth === 1 && [0, 6].includes(month);

            case 'freq-anual': // Anual
                return dayOfMonth === 1 && month === 0;

            default:
                return false;
        }
    });
}

// Generar calendario de un mes
export function generarCalendarioMes(año: number, mes: number, turnoInicial: Turno = 'A'): CalendarioMes {
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const diasMes: DiaCalendario[] = [];
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);

    let totalTareasMes = 0;

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const fecha = new Date(año, mes, dia);
        const turno = getTurnoSemana(fecha, turnoInicial);
        const esTrabajo = esDiaTrabajo(fecha, turno);
        const tareas = esTrabajo ? getTareasParaFecha(fecha) : [];

        totalTareasMes += tareas.length;

        diasMes.push({
            fecha,
            esTrabajo,
            turno,
            tareas,
            totalTareas: tareas.length,
        });
    }

    return {
        mes,
        año,
        nombreMes: nombresMeses[mes],
        dias: diasMes,
        totalTareas: totalTareasMes,
    };
}

// Generar rango de fechas (ej: 24 enero - 28 febrero)
export function generarRangoFechas(
    fechaInicio: Date,
    fechaFin: Date,
    turnoInicial: Turno = 'A'
): DiaCalendario[] {
    const dias: DiaCalendario[] = [];
    const current = new Date(fechaInicio);

    while (current <= fechaFin) {
        const turno = getTurnoSemana(current, turnoInicial);
        const esTrabajo = esDiaTrabajo(current, turno);
        const tareas = esTrabajo ? getTareasParaFecha(current) : [];

        dias.push({
            fecha: new Date(current),
            esTrabajo,
            turno,
            tareas,
            totalTareas: tareas.length,
        });

        current.setDate(current.getDate() + 1);
    }

    return dias;
}

// Resumen de tareas por frecuencia
export function getResumenTareas() {
    const resumen = {
        diarias: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-8hrs').length,
        diaPorMedio: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-dia-medio').length,
        semanales: PUNTOS_LUBRICACION.filter(lp =>
            lp.frequencyId === 'freq-40hrs' || lp.frequencyId === 'freq-semanal'
        ).length,
        quincenales: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-160hrs').length,
        mensuales: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-mensual').length,
        trimestrales: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-trimestral').length,
        semestrales: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-semestral').length,
        anuales: PUNTOS_LUBRICACION.filter(lp => lp.frequencyId === 'freq-anual').length,
        total: PUNTOS_LUBRICACION.length,
    };

    return resumen;
}
