import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ===================================
// CORE SYSTEM
// ===================================

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password'), // In real app: hashed
    role: text('role').notNull(), // 'desarrollador' | 'supervisor' | 'lubricador' | 'supervisor_ext'
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const plants = sqliteTable('plants', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    location: text('location'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const areas = sqliteTable('areas', {
    id: text('id').primaryKey(),
    plantId: text('plant_id').references(() => plants.id).notNull(),
    name: text('name').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const machines = sqliteTable('machines', {
    id: text('id').primaryKey(),
    areaId: text('area_id').references(() => areas.id).notNull(),
    name: text('name').notNull(),
    status: text('status').default('active'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const components = sqliteTable('components', {
    id: text('id').primaryKey(),
    machineId: text('machine_id').references(() => machines.id).notNull(),
    name: text('name').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ===================================
// LUBRICATION PROGRAM
// ===================================

export const lubricants = sqliteTable('lubricants', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(), // 'aceite' | 'grasa'
    pricePerUnit: real('price_per_unit'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const frequencies = sqliteTable('frequencies', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    days: integer('days').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const lubricationPoints = sqliteTable('lubrication_points', {
    id: text('id').primaryKey(),
    componentId: text('component_id').references(() => components.id).notNull(),
    lubricantId: text('lubricant_id').references(() => lubricants.id).notNull(),
    frequencyId: text('frequency_id').references(() => frequencies.id).notNull(),
    code: text('code').notNull(),
    method: text('method').notNull(),
    quantity: real('quantity').notNull(),
    unit: text('unit').default('ml'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ===================================
// EXECUTION & LOGS
// ===================================

export const workOrders = sqliteTable('work_orders', {
    id: text('id').primaryKey(),
    scheduledDate: text('scheduled_date').notNull(),
    status: text('status').notNull(), // 'pendiente' | 'completado'
    technicianId: text('technician_id').references(() => users.id),
    completedAt: text('completed_at'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const tasks = sqliteTable('tasks', {
    id: text('id').primaryKey(),
    workOrderId: text('work_order_id').references(() => workOrders.id).notNull(),
    lubricationPointId: text('lubrication_point_id').references(() => lubricationPoints.id).notNull(),
    status: text('status').notNull(), // 'pendiente' | 'completado' | 'omitido'
    quantityUsed: real('quantity_used'),
    observations: text('observations'),
    photoUrl: text('photo_url'),
    completedAt: text('completed_at'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// ===================================
// INVENTORY & IOT (Phase 2)
// ===================================

export const inventory = sqliteTable('inventory', {
    id: text('id').primaryKey(),
    lubricantId: text('lubricant_id').references(() => lubricants.id).notNull(),
    quantity: real('quantity').notNull(),
    minStock: real('min_stock').notNull(),
    maxStock: real('max_stock').notNull(),
    location: text('location'),
    lastUpdated: text('last_updated').default(sql`CURRENT_TIMESTAMP`),
});

export const sensors = sqliteTable('sensors', {
    id: text('id').primaryKey(),
    machineId: text('machine_id').references(() => machines.id),
    type: text('type').notNull(), // 'vibration' | 'temperature'
    unit: text('unit').notNull(),
    status: text('status').default('online'),
    lastReading: real('last_reading'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const sensorReadings = sqliteTable('sensor_readings', {
    id: text('id').primaryKey(),
    sensorId: text('sensor_id').references(() => sensors.id).notNull(),
    value: real('value').notNull(),
    timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

export const anomalies = sqliteTable('anomalies', {
    id: text('id').primaryKey(),
    machineId: text('machine_id').references(() => machines.id),
    type: text('type').notNull(),
    severity: text('severity').notNull(), // 'baja' | 'media' | 'alta'
    description: text('description'),
    status: text('status').default('abierta'),
    reportedBy: text('reported_by'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
