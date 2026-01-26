-- ============================================================
-- DATOS REALES AISA - SQL COMPLETO V2
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- PLANTA AISA
INSERT INTO plants (id, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'AISA - Planta Aserraderos')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ÁREAS
-- CG 611 - Descortezado
-- CG 612 - Aserradero
INSERT INTO areas (id, plant_id, name) VALUES
    ('aaaaaaaa-8001-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Descortezador Línea Gruesa  (CG 611 / 8001)'),
    ('aaaaaaaa-8002-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Descortezador Línea Delgada (CG 611 / 8002)'),
    ('aaaaaaaa-8006-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Aserradero Línea Gruesa     (CG 612 / 8006)'),
    ('aaaaaaaa-8007-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Aserradero Línea Delgada    (CG 612 / 8007)'),
    ('aaaaaaaa-8010-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'Astillado                   (CG 612 / 8010)')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- MÁQUINAS (26 equipos reales)
INSERT INTO machines (id, area_id, name, status) VALUES
    -- 8001 Descortezador LG
    ('bbbbbbbb-3000-0000-0000-000000000000', 'aaaaaaaa-8001-0000-0000-000000000001', '[3000] Descortezador LG', 'active'),
    ('bbbbbbbb-3002-0000-0000-000000000000', 'aaaaaaaa-8001-0000-0000-000000000001', '[3002] Central hidráulica LG', 'active'),
    ('bbbbbbbb-3100-0000-0000-000000000000', 'aaaaaaaa-8001-0000-0000-000000000001', '[3100] Cadena recepción desde 1700', 'active'),
    ('bbbbbbbb-3200-0000-0000-000000000000', 'aaaaaaaa-8001-0000-0000-000000000001', '[3200] Cadena alimentación LG', 'active'),
    
    -- 8002 Descortezador LD
    ('bbbbbbbb-2100-0000-0000-000000000000', 'aaaaaaaa-8002-0000-0000-000000000002', '[2100] Descortezador LD', 'active'),
    ('bbbbbbbb-1350-0000-0000-000000000000', 'aaaaaaaa-8002-0000-0000-000000000002', '[1350] Central hidráulica DAG izq.', 'active'),
    ('bbbbbbbb-1810-0000-0000-000000000000', 'aaaaaaaa-8002-0000-0000-000000000002', '[1810] Central hidráulica DAG der.', 'active'),

    -- 8007 Línea Delgada
    ('bbbbbbbb-0150-0000-0000-000000000000', 'aaaaaaaa-8007-0000-0000-000000000007', '[150] Shipper Canter 1', 'active'),
    ('bbbbbbbb-0220-0000-0000-000000000000', 'aaaaaaaa-8007-0000-0000-000000000007', '[220] Shipper Canter 2', 'active'),
    ('bbbbbbbb-0042-0000-0000-000000000000', 'aaaaaaaa-8007-0000-0000-000000000007', '[42] Central hidráulica Canter 1', 'active'),
    ('bbbbbbbb-0040-0000-0000-000000000000', 'aaaaaaaa-8007-0000-0000-000000000007', '[40] Central hidráulica Canter 2', 'active'),
    ('bbbbbbbb-0043-0000-0000-000000000000', 'aaaaaaaa-8007-0000-0000-000000000007', '[43] Central hidráulica WD', 'active'),
    ('bbbbbbbb-0041-0000-0000-000000000000', 'aaaaaaaa-8007-0000-0000-000000000007', '[41] Central hidráulica 2900', 'active'),
    ('bbbbbbbb-0260-0000-0000-000000000000', 'aaaaaaaa-8007-0000-0000-000000000007', '[260] Perfiladora LINCK', 'active'),
    ('bbbbbbbb-0300-0000-0000-000000000000', 'aaaaaaaa-8007-0000-0000-000000000007', '[300] FR-10 (WD)', 'active'),
    ('bbbbbbbb-00c1-0000-0000-000000000000', 'aaaaaaaa-8007-0000-0000-000000000007', '[C1] Canter 1', 'active'),
    ('bbbbbbbb-00c2-0000-0000-000000000000', 'aaaaaaaa-8007-0000-0000-000000000007', '[C2] Canter 2', 'active'),

    -- 8006 Línea Gruesa
    ('bbbbbbbb-4800-0000-0000-000000000000', 'aaaaaaaa-8006-0000-0000-000000000006', '[4800] HMK20', 'active'),
    ('bbbbbbbb-4810-0000-0000-000000000000', 'aaaaaaaa-8006-0000-0000-000000000006', '[4810] Central hidráulica HMK20', 'active'),
    ('bbbbbbbb-5050-0000-0000-000000000000', 'aaaaaaaa-8006-0000-0000-000000000006', '[5050] Canteadora LINCK', 'active'),
    ('bbbbbbbb-5060-0000-0000-000000000000', 'aaaaaaaa-8006-0000-0000-000000000006', '[5060] Central hidráulica LINCK', 'active'),
    ('bbbbbbbb-5750-0000-0000-000000000000', 'aaaaaaaa-8006-0000-0000-000000000006', '[5750] Canteadora ESTERER', 'active'),
    ('bbbbbbbb-6600-0000-0000-000000000000', 'aaaaaaaa-8006-0000-0000-000000000006', '[6600] PENDU', 'active'),
    ('bbbbbbbb-4200-0000-0000-000000000000', 'aaaaaaaa-8006-0000-0000-000000000006', '[4200] VQT-1', 'active'),
    ('bbbbbbbb-4250-0000-0000-000000000000', 'aaaaaaaa-8006-0000-0000-000000000006', '[4250] VQT-2', 'active'),
    ('bbbbbbbb-5500-0000-0000-000000000000', 'aaaaaaaa-8006-0000-0000-000000000006', '[5500] Máquina GRIMME', 'active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status;

-- COMPONENTES (Creación masiva de componentes asociados a cada equipo)
INSERT INTO components (id, machine_id, name) 
SELECT 
    uuid_generate_v5(uuid_ns_url(), machine.id::text || '-comp-default'),
    machine.id,
    'Componente Principal'
FROM machines machine
ON CONFLICT (id) DO NOTHING;

-- LUBRICANTES
INSERT INTO lubricants (id, name, type) VALUES
    ('dddddddd-0026-0000-0000-000000000000', 'DTE-26 (Mobil)', 'aceite'),
    ('dddddddd-0024-0000-0000-000000000000', 'DTE-24 (Mobil)', 'aceite'),
    ('dddddddd-0150-0000-0000-000000000000', 'EP-150 (Mobil)', 'aceite'),
    ('dddddddd-8090-0000-0000-000000000000', '80W-90 (Mobil)', 'aceite'),
    ('dddddddd-0001-0000-0000-000000000000', 'Grasa Azul', 'grasa'),
    ('dddddddd-0002-0000-0000-000000000000', 'Grasa Roja', 'grasa'),
    ('dddddddd-kp2k-0000-0000-000000000000', 'KP2K', 'grasa'),
    ('dddddddd-nu15-0000-0000-000000000000', 'ISOFLEX NBU 15', 'grasa'),
    ('dddddddd-1y22-0000-0000-000000000000', 'Grasa I y II', 'grasa')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- FRECUENCIAS
INSERT INTO frequencies (id, name, days) VALUES
    ('eeeeeeee-0001-0000-0000-000000000001', 'Cada 8 horas (Diaria)', 1),
    ('eeeeeeee-0002-0000-0000-000000000002', 'Día por medio', 2),
    ('eeeeeeee-0007-0000-0000-000000000007', 'Cada 40 horas (Semanal)', 7),
    ('eeeeeeee-0014-0000-0000-000000000014', 'Cada 160 horas (Quincenal)', 14),
    ('eeeeeeee-0030-0000-0000-000000000030', 'Mensual', 30),
    ('eeeeeeee-0365-0000-0000-000000000000', 'Cada 7000 horas (Anual)', 365)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, days = EXCLUDED.days;

-- PUNTOS DE LUBRICACIÓN (52 puntos reales)
-- Se usa un generador UUID determinista basado en el código para consistencia
INSERT INTO lubrication_points (id, component_id, machine_id, lubricant_id, frequency_id, code, description, method, quantity, unit) 
VALUES
    -- Descortezador LG (3000)
    (uuid_generate_v5(uuid_ns_url(), 'LP-3000-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-3000-0000-0000-000000000000-comp-default'), 'bbbbbbbb-3000-0000-0000-000000000000', 'dddddddd-0002-0000-0000-000000000000', 'eeeeeeee-0002-0000-0000-000000000002', 'LP-3000-1', 'Cuchillos', 'manual', 50, 'gr'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-3000-2'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-3000-0000-0000-000000000000-comp-default'), 'bbbbbbbb-3000-0000-0000-000000000000', 'dddddddd-8090-0000-0000-000000000000', 'eeeeeeee-0014-0000-0000-000000000014', 'LP-3000-2', 'Rotor (Lavado + cambio aceite)', 'manual', 2000, 'ml'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-3000-5'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-3000-0000-0000-000000000000-comp-default'), 'bbbbbbbb-3000-0000-0000-000000000000', 'dddddddd-0001-0000-0000-000000000000', 'eeeeeeee-0030-0000-0000-000000000030', 'LP-3000-5', 'Rodamientos y soportes', 'manual', 200, 'gr'),
    -- Central 3002
    (uuid_generate_v5(uuid_ns_url(), 'LP-3002-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-3002-0000-0000-000000000000-comp-default'), 'bbbbbbbb-3002-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-3002-1', 'Depósito Central LG', 'manual', 0, 'ml'),
    -- Cadenas
    (uuid_generate_v5(uuid_ns_url(), 'LP-3100-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-3100-0000-0000-000000000000-comp-default'), 'bbbbbbbb-3100-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-3100-1', 'Cadena recepción', 'manual', 100, 'ml'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-3200-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-3200-0000-0000-000000000000-comp-default'), 'bbbbbbbb-3200-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-3200-1', 'Cadena alimentación', 'manual', 100, 'ml'),
    
    -- Descortezador LD (2100)
    (uuid_generate_v5(uuid_ns_url(), 'LP-2100-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-2100-0000-0000-000000000000-comp-default'), 'bbbbbbbb-2100-0000-0000-000000000000', 'dddddddd-0002-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-2100-1', 'Cuchillos LD', 'manual', 50, 'gr'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-2100-2'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-2100-0000-0000-000000000000-comp-default'), 'bbbbbbbb-2100-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-2100-2', 'Cadenas LD', 'manual', 100, 'ml'),
    -- Centrales
    (uuid_generate_v5(uuid_ns_url(), 'LP-1350-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-1350-0000-0000-000000000000-comp-default'), 'bbbbbbbb-1350-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-1350-1', 'Depósito DAG izq.', 'manual', 0, 'ml'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-1810-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-1810-0000-0000-000000000000-comp-default'), 'bbbbbbbb-1810-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-1810-1', 'Depósito DAG der.', 'manual', 0, 'ml'),

    -- Canter 1 y 2
    (uuid_generate_v5(uuid_ns_url(), 'LP-150-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-0150-0000-0000-000000000000-comp-default'), 'bbbbbbbb-0150-0000-0000-000000000000', 'dddddddd-0001-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-150-1', 'Shipper Canter 1', 'manual', 30, 'gr'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-220-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-0220-0000-0000-000000000000-comp-default'), 'bbbbbbbb-0220-0000-0000-000000000000', 'dddddddd-0001-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-220-1', 'Shipper Canter 2', 'manual', 30, 'gr'),
    -- Centrales Canter
    (uuid_generate_v5(uuid_ns_url(), 'LP-42-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-0042-0000-0000-000000000000-comp-default'), 'bbbbbbbb-0042-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-42-1', 'Central Canter 1', 'manual', 0, 'ml'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-40-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-0040-0000-0000-000000000000-comp-default'), 'bbbbbbbb-0040-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-40-1', 'Central Canter 2', 'manual', 0, 'ml'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-43-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-0043-0000-0000-000000000000-comp-default'), 'bbbbbbbb-0043-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-43-1', 'Central WD', 'manual', 0, 'ml'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-41-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-0041-0000-0000-000000000000-comp-default'), 'bbbbbbbb-0041-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-41-1', 'Central 2900', 'manual', 0, 'ml'),

    -- Perfiladora LINCK (260)
    (uuid_generate_v5(uuid_ns_url(), 'LP-260-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-0260-0000-0000-000000000000-comp-default'), 'bbbbbbbb-0260-0000-0000-000000000000', 'dddddddd-kp2k-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-260-1', 'Guías lineales BV y ejes HV', 'manual', 10, 'gr'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-260-2'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-0260-0000-0000-000000000000-comp-default'), 'bbbbbbbb-0260-0000-0000-000000000000', 'dddddddd-kp2k-0000-0000-000000000000', 'eeeeeeee-0007-0000-0000-000000000007', 'LP-260-2', 'Guía de ajuste', 'manual', 10, 'gr'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-260-3'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-0260-0000-0000-000000000000-comp-default'), 'bbbbbbbb-0260-0000-0000-000000000000', 'dddddddd-kp2k-0000-0000-000000000000', 'eeeeeeee-0007-0000-0000-000000000007', 'LP-260-3', 'Eje de conexión', 'manual', 10, 'gr'),
    
    -- WD (300)
    (uuid_generate_v5(uuid_ns_url(), 'LP-300-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-0300-0000-0000-000000000000-comp-default'), 'bbbbbbbb-0300-0000-0000-000000000000', 'dddddddd-0024-0000-0000-000000000000', 'eeeeeeee-0002-0000-0000-000000000002', 'LP-300-1', 'Sistema Bijur WD', 'manual', 500, 'ml'),

    -- HMK20 (4800)
    (uuid_generate_v5(uuid_ns_url(), 'LP-4800-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-4800-0000-0000-000000000000-comp-default'), 'bbbbbbbb-4800-0000-0000-000000000000', 'dddddddd-0001-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-4800-1', 'Engrasado General HMK20', 'manual', 50, 'gr'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-4810-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-4810-0000-0000-000000000000-comp-default'), 'bbbbbbbb-4810-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-4810-1', 'Central HMK20', 'manual', 0, 'ml'),

    -- Canteadora LINCK (5050)
    (uuid_generate_v5(uuid_ns_url(), 'LP-5050-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-5050-0000-0000-000000000000-comp-default'), 'bbbbbbbb-5050-0000-0000-000000000000', 'dddddddd-0001-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-5050-1', 'General Canteadora', 'manual', 50, 'gr'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-5060-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-5060-0000-0000-000000000000-comp-default'), 'bbbbbbbb-5060-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-5060-1', 'Central Canteadora', 'manual', 0, 'ml'),

    -- Canteadora ESTERER (5750)
    (uuid_generate_v5(uuid_ns_url(), 'LP-5750-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-5750-0000-0000-000000000000-comp-default'), 'bbbbbbbb-5750-0000-0000-000000000000', 'dddddddd-0001-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-5750-1', 'General ESTERER', 'manual', 50, 'gr'),

    -- PENDU (6600)
    (uuid_generate_v5(uuid_ns_url(), 'LP-6600-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-6600-0000-0000-000000000000-comp-default'), 'bbbbbbbb-6600-0000-0000-000000000000', 'dddddddd-0001-0000-0000-000000000000', 'eeeeeeee-0001-0000-0000-000000000001', 'LP-6600-1', 'General PENDU', 'manual', 50, 'gr'),

    -- VQT-1 (4200)
    (uuid_generate_v5(uuid_ns_url(), 'LP-4200-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-4200-0000-0000-000000000000-comp-default'), 'bbbbbbbb-4200-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0002-0000-0000-000000000002', 'LP-4200-1', 'Sistema VQT-1', 'manual', 100, 'ml'),
    
    -- VQT-2 (4250)
    (uuid_generate_v5(uuid_ns_url(), 'LP-4250-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-4250-0000-0000-000000000000-comp-default'), 'bbbbbbbb-4250-0000-0000-000000000000', 'dddddddd-0026-0000-0000-000000000000', 'eeeeeeee-0002-0000-0000-000000000002', 'LP-4250-1', 'Sistema VQT-2', 'manual', 100, 'ml'),

    -- Canter 1 (Detalle Excel)
    (uuid_generate_v5(uuid_ns_url(), 'LP-C1-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-00c1-0000-0000-000000000000-comp-default'), 'bbbbbbbb-00c1-0000-0000-000000000000', 'dddddddd-1y22-0000-0000-000000000000', 'eeeeeeee-0030-0000-0000-000000000030', 'LP-C1-1', 'Rodamiento polea transmisión', 'manual', 100, 'gr'),
    (uuid_generate_v5(uuid_ns_url(), 'LP-C1-4'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-00c1-0000-0000-000000000000-comp-default'), 'bbbbbbbb-00c1-0000-0000-000000000000', 'dddddddd-1y22-0000-0000-000000000000', 'eeeeeeee-0007-0000-0000-000000000007', 'LP-C1-4', 'Cardan de transmisión', 'manual', 80, 'gr'),

    -- Canter 2 (Detalle Excel)
    (uuid_generate_v5(uuid_ns_url(), 'LP-C2-1'), uuid_generate_v5(uuid_ns_url(), 'bbbbbbbb-00c2-0000-0000-000000000000-comp-default'), 'bbbbbbbb-00c2-0000-0000-000000000000', 'dddddddd-1y22-0000-0000-000000000000', 'eeeeeeee-0030-0000-0000-000000000030', 'LP-C2-1', 'Rodamiento polea transmisión', 'manual', 100, 'gr')
ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description, quantity = EXCLUDED.quantity;

-- CREAR ORDEN DE TRABAJO PARA HOY
INSERT INTO work_orders (id, scheduled_date, status, notes) 
VALUES ('00000000-0000-0000-0000-000000000001', CURRENT_DATE, 'pendiente', 'Orden de trabajo automática - Manual AISA 2026')
ON CONFLICT (id) DO UPDATE SET scheduled_date = CURRENT_DATE;

-- CREAR TAREAS PARA HOY (Solo frecuencias: Diario y Día por medio)
INSERT INTO tasks (id, work_order_id, lubrication_point_id, status)
SELECT 
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    id,
    'pendiente'
FROM lubrication_points
WHERE frequency_id IN ('eeeeeeee-0001-0000-0000-000000000001', 'eeeeeeee-0002-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- VERIFICACIÓN
SELECT 'DATOS COMPLETOS CARGADOS' as status;
SELECT COUNT(*) as puntos_totales_manual_aisa FROM lubrication_points;
SELECT COUNT(*) as tareas_hoy_generadas FROM tasks WHERE work_order_id = '00000000-0000-0000-0000-000000000001';
