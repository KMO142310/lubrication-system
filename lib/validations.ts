// Zod Validation Schemas
// Enterprise-grade input validation

import { z } from 'zod';

// ============================================================
// BASE SCHEMAS
// ============================================================

export const IdSchema = z.string().uuid();
export const DateSchema = z.string().datetime();

// ============================================================
// ENTITY SCHEMAS
// ============================================================

export const PlantSchema = z.object({
    id: IdSchema.optional(),
    name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
    code: z.string().max(20).optional(),
    location: z.string().max(200).optional(),
});

export const AreaSchema = z.object({
    id: IdSchema.optional(),
    plantId: IdSchema,
    name: z.string().min(2).max(100),
    code: z.string().max(20).optional(),
});

export const MachineSchema = z.object({
    id: IdSchema.optional(),
    areaId: IdSchema,
    name: z.string().min(2).max(100),
    code: z.string().max(20).optional(),
    make: z.string().max(50).optional(),
    model: z.string().max(50).optional(),
    serialNumber: z.string().max(50).optional(),
    installDate: z.string().optional(),
    status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
});

export const ComponentSchema = z.object({
    id: IdSchema.optional(),
    machineId: IdSchema,
    name: z.string().min(2).max(100),
    type: z.string().max(50).optional(),
});

export const LubricantSchema = z.object({
    id: IdSchema.optional(),
    name: z.string().min(2).max(100),
    code: z.string().max(20).optional(),
    type: z.enum(['aceite', 'grasa']),
    brand: z.string().max(50).optional(),
    viscosity: z.string().max(30).optional(),
    nlgiGrade: z.string().max(20).optional(),
    unitPrice: z.number().min(0).optional(),
    stockQuantity: z.number().min(0).default(0),
    minStock: z.number().min(0).default(0),
});

export const LubricationPointSchema = z.object({
    id: IdSchema.optional(),
    componentId: IdSchema,
    lubricantId: IdSchema,
    frequencyId: IdSchema,
    code: z.string().min(3).max(30),
    description: z.string().min(5).max(200),
    method: z.enum(['manual', 'centralizado', 'automatico']).default('manual'),
    quantity: z.number().min(0),
    unit: z.enum(['ml', 'g', 'L', 'kg']).default('ml'),
    accessNotes: z.string().max(500).optional(),
    safetyNotes: z.string().max(500).optional(),
    photoRequired: z.boolean().default(false),
});

export const TaskUpdateSchema = z.object({
    taskId: IdSchema,
    status: z.enum(['pendiente', 'completado', 'omitido']),
    quantityUsed: z.number().min(0).optional(),
    photoBeforeUrl: z.string().url().optional(),
    photoAfterUrl: z.string().url().optional(),
    observations: z.string().max(1000).optional(),
});

export const AnomalySchema = z.object({
    id: IdSchema.optional(),
    taskId: IdSchema.optional(),
    machineId: IdSchema.optional(),
    lubricationPointId: IdSchema.optional(),
    description: z.string().min(10, 'Descripción debe tener al menos 10 caracteres').max(1000),
    severity: z.enum(['baja', 'media', 'alta', 'critica']),
    photoUrls: z.array(z.string().url()).optional(),
});

export const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

export const ProfileUpdateSchema = z.object({
    fullName: z.string().min(2).max(100).optional(),
    phone: z.string().max(20).optional(),
    company: z.string().max(100).optional(),
});

// ============================================================
// TYPE EXPORTS
// ============================================================

export type PlantInput = z.infer<typeof PlantSchema>;
export type AreaInput = z.infer<typeof AreaSchema>;
export type MachineInput = z.infer<typeof MachineSchema>;
export type ComponentInput = z.infer<typeof ComponentSchema>;
export type LubricantInput = z.infer<typeof LubricantSchema>;
export type LubricationPointInput = z.infer<typeof LubricationPointSchema>;
export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>;
export type AnomalyInput = z.infer<typeof AnomalySchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
