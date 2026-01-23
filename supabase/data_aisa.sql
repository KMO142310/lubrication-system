-- ============================================================
-- DATOS REALES AISA - Programa de Lubricación
-- Ejecutar DESPUÉS de setup.sql
-- ============================================================

-- PLANTA AISA
INSERT INTO plants (id, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'AISA - Planta Aserraderos')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ÁREAS (Líneas de Producción)
INSERT INTO areas (id, plant_id, name) VALUES
    ('aaaa0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Canter 1 y 2'),
    ('aaaa0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Perfiladora LINCK'),
    ('aaaa0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Línea Clasificadora'),
    ('aaaa0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Descortezador'),
    ('aaaa0005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Sistema Hidráulico')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- MÁQUINAS (Secciones)
INSERT INTO machines (id, area_id, name) VALUES
    -- Canter 1 y 2
    ('mmmm0001-0000-0000-0000-000000000001', 'aaaa0001-0000-0000-0000-000000000001', '9.1.1 Transmisión (Drive Shaft)'),
    ('mmmm0002-0000-0000-0000-000000000002', 'aaaa0001-0000-0000-0000-000000000001', '9.1.2 Rodillos de Avance Verticales'),
    ('mmmm0003-0000-0000-0000-000000000003', 'aaaa0001-0000-0000-0000-000000000001', '9.1.3 Cabezal de Corte'),
    -- Perfiladora LINCK
    ('mmmm0004-0000-0000-0000-000000000004', 'aaaa0002-0000-0000-0000-000000000002', '9.2.1 Sistema de Guías'),
    ('mmmm0005-0000-0000-0000-000000000005', 'aaaa0002-0000-0000-0000-000000000002', '9.2.2 Sistema de Ajuste'),
    ('mmmm0006-0000-0000-0000-000000000006', 'aaaa0002-0000-0000-0000-000000000002', '9.2.3 Rodillos y Transmisión'),
    -- Línea Clasificadora
    ('mmmm0007-0000-0000-0000-000000000007', 'aaaa0003-0000-0000-0000-000000000003', 'Transportadores'),
    ('mmmm0008-0000-0000-0000-000000000008', 'aaaa0003-0000-0000-0000-000000000003', 'Clasificadores'),
    -- Descortezador
    ('mmmm0009-0000-0000-0000-000000000009', 'aaaa0004-0000-0000-0000-000000000004', 'Cabezal Descortezador'),
    ('mmmm0010-0000-0000-0000-000000000010', 'aaaa0004-0000-0000-0000-000000000004', 'Sistema de Alimentación'),
    -- Sistema Hidráulico
    ('mmmm0011-0000-0000-0000-000000000011', 'aaaa0005-0000-0000-0000-000000000005', 'Unidad Hidráulica Principal'),
    ('mmmm0012-0000-0000-0000-000000000012', 'aaaa0005-0000-0000-0000-000000000005', 'Cilindros y Válvulas')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- COMPONENTES
INSERT INTO components (id, machine_id, name) VALUES
    -- Canter Transmisión
    ('cccc0001-0000-0000-0000-000000000001', 'mmmm0001-0000-0000-0000-000000000001', 'Eje estriado'),
    ('cccc0002-0000-0000-0000-000000000002', 'mmmm0001-0000-0000-0000-000000000001', 'Rodamiento polea transmisión'),
    ('cccc0003-0000-0000-0000-000000000003', 'mmmm0001-0000-0000-0000-000000000001', 'Rodamiento polea dentada'),
    ('cccc0004-0000-0000-0000-000000000004', 'mmmm0001-0000-0000-0000-000000000001', 'Rodamiento polea tensora'),
    -- Canter Rodillos
    ('cccc0005-0000-0000-0000-000000000005', 'mmmm0002-0000-0000-0000-000000000002', 'Cardan de transmisión'),
    ('cccc0006-0000-0000-0000-000000000006', 'mmmm0002-0000-0000-0000-000000000002', 'Eje de rodillos'),
    ('cccc0007-0000-0000-0000-000000000007', 'mmmm0002-0000-0000-0000-000000000002', 'Rodamiento rodillos verticales'),
    ('cccc0008-0000-0000-0000-000000000008', 'mmmm0002-0000-0000-0000-000000000002', 'Reductores de avance'),
    -- Perfiladora Guías
    ('cccc0009-0000-0000-0000-000000000009', 'mmmm0004-0000-0000-0000-000000000004', 'Guías lineales BV'),
    ('cccc0010-0000-0000-0000-000000000010', 'mmmm0004-0000-0000-0000-000000000004', 'Ejes HV'),
    -- Perfiladora Ajuste
    ('cccc0011-0000-0000-0000-000000000011', 'mmmm0005-0000-0000-0000-000000000005', 'Guía de ajuste'),
    ('cccc0012-0000-0000-0000-000000000012', 'mmmm0005-0000-0000-0000-000000000005', 'Eje de conexión'),
    ('cccc0013-0000-0000-0000-000000000013', 'mmmm0005-0000-0000-0000-000000000005', 'Husillo roscado trapezoidal'),
    ('cccc0014-0000-0000-0000-000000000014', 'mmmm0005-0000-0000-0000-000000000005', 'Acople eje estriado'),
    ('cccc0015-0000-0000-0000-000000000015', 'mmmm0005-0000-0000-0000-000000000005', 'Piñones (sprockets)'),
    ('cccc0016-0000-0000-0000-000000000016', 'mmmm0005-0000-0000-0000-000000000005', 'Engranaje sinfín'),
    -- Perfiladora Rodillos
    ('cccc0017-0000-0000-0000-000000000017', 'mmmm0006-0000-0000-0000-000000000006', 'Rodillos de guía'),
    ('cccc0018-0000-0000-0000-000000000018', 'mmmm0006-0000-0000-0000-000000000006', 'Cadenas de transmisión'),
    ('cccc0019-0000-0000-0000-000000000019', 'mmmm0006-0000-0000-0000-000000000006', 'Reductores'),
    -- Clasificadora
    ('cccc0020-0000-0000-0000-000000000020', 'mmmm0007-0000-0000-0000-000000000007', 'Cadenas transportadoras'),
    ('cccc0021-0000-0000-0000-000000000021', 'mmmm0007-0000-0000-0000-000000000007', 'Rodamientos de rodillos'),
    ('cccc0022-0000-0000-0000-000000000022', 'mmmm0008-0000-0000-0000-000000000008', 'Actuadores neumáticos'),
    ('cccc0023-0000-0000-0000-000000000023', 'mmmm0008-0000-0000-0000-000000000008', 'Guías lineales'),
    -- Descortezador
    ('cccc0024-0000-0000-0000-000000000024', 'mmmm0009-0000-0000-0000-000000000009', 'Rodamientos cabezal'),
    ('cccc0025-0000-0000-0000-000000000025', 'mmmm0009-0000-0000-0000-000000000009', 'Cuchillas rotativas'),
    ('cccc0026-0000-0000-0000-000000000026', 'mmmm0010-0000-0000-0000-000000000010', 'Rodillos alimentación'),
    ('cccc0027-0000-0000-0000-000000000027', 'mmmm0010-0000-0000-0000-000000000010', 'Cadenas de arrastre'),
    -- Sistema Hidráulico
    ('cccc0028-0000-0000-0000-000000000028', 'mmmm0011-0000-0000-0000-000000000011', 'Bomba hidráulica'),
    ('cccc0029-0000-0000-0000-000000000029', 'mmmm0011-0000-0000-0000-000000000011', 'Filtros'),
    ('cccc0030-0000-0000-0000-000000000030', 'mmmm0012-0000-0000-0000-000000000012', 'Cilindros principales'),
    ('cccc0031-0000-0000-0000-000000000031', 'mmmm0012-0000-0000-0000-000000000012', 'Válvulas proporcionales')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- LUBRICANTES
INSERT INTO lubricants (id, name, type, unit, stock) VALUES
    ('llll0001-0000-0000-0000-000000000001', 'Grasa I y II (EP2)', 'grasa', 'g', 15000),
    ('llll0002-0000-0000-0000-000000000002', 'KP2K', 'grasa', 'g', 10000),
    ('llll0003-0000-0000-0000-000000000003', 'Aceite ISO 150', 'aceite', 'ml', 50000),
    ('llll0004-0000-0000-0000-000000000004', 'Aceite ISO 220', 'aceite', 'ml', 30000),
    ('llll0005-0000-0000-0000-000000000005', 'Aceite Hidráulico ISO 46', 'aceite', 'ml', 100000),
    ('llll0006-0000-0000-0000-000000000006', 'Grasa Cadenas', 'grasa', 'g', 8000)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, stock = EXCLUDED.stock;

-- FRECUENCIAS
INSERT INTO frequencies (id, name, days) VALUES
    ('ffff0001-0000-0000-0000-000000000001', 'Cada 8 horas (Diario)', 1),
    ('ffff0002-0000-0000-0000-000000000002', 'Cada 40 horas (Semanal)', 7),
    ('ffff0003-0000-0000-0000-000000000003', 'Cada 160 horas (Mensual)', 30),
    ('ffff0004-0000-0000-0000-000000000004', 'Cada 500 horas (Trimestral)', 90),
    ('ffff0005-0000-0000-0000-000000000005', 'Cada 2000 horas (Semestral)', 180),
    ('ffff0006-0000-0000-0000-000000000006', 'Cada 7000 horas (Anual)', 365)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- PUNTOS DE LUBRICACIÓN (Datos reales del Excel AISA)
INSERT INTO lubrication_points (id, component_id, lubricant_id, frequency_id, code, description, method, quantity) VALUES
    -- CANTER 1 y 2 - Transmisión
    ('pppp0001-0000-0000-0000-000000000001', 'cccc0001-0000-0000-0000-000000000001', 'llll0001-0000-0000-0000-000000000001', 'ffff0001-0000-0000-0000-000000000001', '9.1.1-B', 'Eje estriado - Lubricar puntos de engrase', 'manual', 120),
    ('pppp0002-0000-0000-0000-000000000002', 'cccc0002-0000-0000-0000-000000000002', 'llll0001-0000-0000-0000-000000000001', 'ffff0003-0000-0000-0000-000000000003', '9.1.1-A', 'Rodamiento polea transmisión - Verificar y engrasar', 'manual', 100),
    ('pppp0003-0000-0000-0000-000000000003', 'cccc0003-0000-0000-0000-000000000003', 'llll0001-0000-0000-0000-000000000001', 'ffff0003-0000-0000-0000-000000000003', '9.1.1-C', 'Rodamiento polea dentada - Engrasar', 'manual', 200),
    ('pppp0004-0000-0000-0000-000000000004', 'cccc0004-0000-0000-0000-000000000004', 'llll0001-0000-0000-0000-000000000001', 'ffff0003-0000-0000-0000-000000000003', '9.1.1-D', 'Rodamiento polea tensora - Engrasar', 'manual', 80),
    
    -- CANTER 1 y 2 - Rodillos
    ('pppp0005-0000-0000-0000-000000000005', 'cccc0005-0000-0000-0000-000000000005', 'llll0001-0000-0000-0000-000000000001', 'ffff0002-0000-0000-0000-000000000002', '9.1.2-B', 'Cardan de transmisión - 4 puntos de engrase', 'manual', 80),
    ('pppp0006-0000-0000-0000-000000000006', 'cccc0006-0000-0000-0000-000000000006', 'llll0001-0000-0000-0000-000000000001', 'ffff0002-0000-0000-0000-000000000002', '9.1.2-C', 'Eje de rodillos - 2 puntos', 'manual', 80),
    ('pppp0007-0000-0000-0000-000000000007', 'cccc0007-0000-0000-0000-000000000007', 'llll0001-0000-0000-0000-000000000001', 'ffff0002-0000-0000-0000-000000000002', '9.1.2-D', 'Rodamiento rodillos verticales - 4 puntos', 'manual', 80),
    ('pppp0008-0000-0000-0000-000000000008', 'cccc0008-0000-0000-0000-000000000008', 'llll0003-0000-0000-0000-000000000003', 'ffff0006-0000-0000-0000-000000000006', '9.1.2-A', 'Reductores de avance - Cambio de aceite', 'manual', 1900),
    
    -- PERFILADORA LINCK - Guías (Cada 8 hrs)
    ('pppp0009-0000-0000-0000-000000000009', 'cccc0009-0000-0000-0000-000000000009', 'llll0002-0000-0000-0000-000000000002', 'ffff0001-0000-0000-0000-000000000001', '9.2.1-10', 'Guías lineales BV y ejes HV - 16 puntos', 'manual', 10),
    
    -- PERFILADORA LINCK - Ajuste (Cada 40 hrs)
    ('pppp0010-0000-0000-0000-000000000010', 'cccc0011-0000-0000-0000-000000000011', 'llll0002-0000-0000-0000-000000000002', 'ffff0002-0000-0000-0000-000000000002', '9.2.2-4', 'Guía de ajuste - 2 puntos', 'manual', 10),
    ('pppp0011-0000-0000-0000-000000000011', 'cccc0012-0000-0000-0000-000000000012', 'llll0002-0000-0000-0000-000000000002', 'ffff0002-0000-0000-0000-000000000002', '9.2.2-5', 'Eje de conexión - 8 puntos', 'manual', 10),
    ('pppp0012-0000-0000-0000-000000000012', 'cccc0013-0000-0000-0000-000000000013', 'llll0002-0000-0000-0000-000000000002', 'ffff0002-0000-0000-0000-000000000002', '9.2.2-7', 'Husillo roscado trapezoidal - 2 puntos', 'manual', 10),
    ('pppp0013-0000-0000-0000-000000000013', 'cccc0014-0000-0000-0000-000000000014', 'llll0002-0000-0000-0000-000000000002', 'ffff0002-0000-0000-0000-000000000002', '9.2.2-8', 'Acople eje estriado - 4 puntos', 'manual', 10),
    ('pppp0014-0000-0000-0000-000000000014', 'cccc0015-0000-0000-0000-000000000015', 'llll0002-0000-0000-0000-000000000002', 'ffff0002-0000-0000-0000-000000000002', '9.2.2-14', 'Piñones (sprockets) - 2 puntos', 'manual', 10),
    ('pppp0015-0000-0000-0000-000000000015', 'cccc0016-0000-0000-0000-000000000016', 'llll0002-0000-0000-0000-000000000002', 'ffff0002-0000-0000-0000-000000000002', '9.2.2-17', 'Engranaje sinfín - 4 puntos', 'manual', 10),
    
    -- PERFILADORA LINCK - Rodillos (Cada 160 hrs)
    ('pppp0016-0000-0000-0000-000000000016', 'cccc0017-0000-0000-0000-000000000017', 'llll0002-0000-0000-0000-000000000002', 'ffff0003-0000-0000-0000-000000000003', '9.2.3-1', 'Rodillos de guía - 2 puntos', 'manual', 10),
    ('pppp0017-0000-0000-0000-000000000017', 'cccc0018-0000-0000-0000-000000000018', 'llll0006-0000-0000-0000-000000000006', 'ffff0002-0000-0000-0000-000000000002', '9.2.3-2', 'Cadenas de transmisión - Lubricar', 'manual', 50),
    ('pppp0018-0000-0000-0000-000000000018', 'cccc0019-0000-0000-0000-000000000019', 'llll0004-0000-0000-0000-000000000004', 'ffff0005-0000-0000-0000-000000000005', '9.2.3-3', 'Reductores - Verificar nivel aceite', 'manual', 500),
    
    -- CLASIFICADORA
    ('pppp0019-0000-0000-0000-000000000019', 'cccc0020-0000-0000-0000-000000000020', 'llll0006-0000-0000-0000-000000000006', 'ffff0002-0000-0000-0000-000000000002', 'CL-01', 'Cadenas transportadoras - Lubricar', 'manual', 100),
    ('pppp0020-0000-0000-0000-000000000020', 'cccc0021-0000-0000-0000-000000000021', 'llll0001-0000-0000-0000-000000000001', 'ffff0003-0000-0000-0000-000000000003', 'CL-02', 'Rodamientos de rodillos - Engrasar', 'manual', 50),
    ('pppp0021-0000-0000-0000-000000000021', 'cccc0022-0000-0000-0000-000000000022', 'llll0001-0000-0000-0000-000000000001', 'ffff0003-0000-0000-0000-000000000003', 'CL-03', 'Actuadores neumáticos - Lubricar', 'manual', 20),
    ('pppp0022-0000-0000-0000-000000000022', 'cccc0023-0000-0000-0000-000000000023', 'llll0002-0000-0000-0000-000000000002', 'ffff0002-0000-0000-0000-000000000002', 'CL-04', 'Guías lineales clasificador - Lubricar', 'manual', 30),
    
    -- DESCORTEZADOR
    ('pppp0023-0000-0000-0000-000000000023', 'cccc0024-0000-0000-0000-000000000024', 'llll0001-0000-0000-0000-000000000001', 'ffff0001-0000-0000-0000-000000000001', 'DC-01', 'Rodamientos cabezal descortezador - Engrasar diario', 'manual', 150),
    ('pppp0024-0000-0000-0000-000000000024', 'cccc0025-0000-0000-0000-000000000025', 'llll0001-0000-0000-0000-000000000001', 'ffff0002-0000-0000-0000-000000000002', 'DC-02', 'Cuchillas rotativas - Lubricar eje', 'manual', 80),
    ('pppp0025-0000-0000-0000-000000000025', 'cccc0026-0000-0000-0000-000000000026', 'llll0001-0000-0000-0000-000000000001', 'ffff0002-0000-0000-0000-000000000002', 'DC-03', 'Rodillos alimentación - Engrasar', 'manual', 60),
    ('pppp0026-0000-0000-0000-000000000026', 'cccc0027-0000-0000-0000-000000000027', 'llll0006-0000-0000-0000-000000000006', 'ffff0002-0000-0000-0000-000000000002', 'DC-04', 'Cadenas de arrastre - Lubricar', 'manual', 100),
    
    -- SISTEMA HIDRÁULICO
    ('pppp0027-0000-0000-0000-000000000027', 'cccc0028-0000-0000-0000-000000000028', 'llll0005-0000-0000-0000-000000000005', 'ffff0005-0000-0000-0000-000000000005', 'HID-01', 'Bomba hidráulica - Verificar nivel y cambio', 'manual', 5000),
    ('pppp0028-0000-0000-0000-000000000028', 'cccc0029-0000-0000-0000-000000000029', 'llll0005-0000-0000-0000-000000000005', 'ffff0003-0000-0000-0000-000000000003', 'HID-02', 'Filtros hidráulicos - Verificar/cambiar', 'manual', 0),
    ('pppp0029-0000-0000-0000-000000000029', 'cccc0030-0000-0000-0000-000000000030', 'llll0001-0000-0000-0000-000000000001', 'ffff0003-0000-0000-0000-000000000003', 'HID-03', 'Cilindros principales - Engrasar vástagos', 'manual', 50),
    ('pppp0030-0000-0000-0000-000000000030', 'cccc0031-0000-0000-0000-000000000031', 'llll0005-0000-0000-0000-000000000005', 'ffff0004-0000-0000-0000-000000000004', 'HID-04', 'Válvulas proporcionales - Verificar', 'manual', 0)
ON CONFLICT (id) DO UPDATE SET 
    description = EXCLUDED.description,
    quantity = EXCLUDED.quantity;

-- GENERAR TAREAS PARA HOY Y LA SEMANA
DO $$
DECLARE
    v_date DATE;
    v_point RECORD;
    v_day_of_week INT;
    v_day_of_month INT;
BEGIN
    -- Generar tareas para los próximos 7 días
    FOR i IN 0..6 LOOP
        v_date := CURRENT_DATE + i;
        v_day_of_week := EXTRACT(DOW FROM v_date);
        v_day_of_month := EXTRACT(DAY FROM v_date);
        
        FOR v_point IN 
            SELECT lp.id as point_id, f.days as freq_days
            FROM lubrication_points lp
            JOIN frequencies f ON lp.frequency_id = f.id
        LOOP
            -- Lógica de frecuencias
            IF v_point.freq_days = 1 THEN
                -- Diario: siempre
                INSERT INTO tasks (lubrication_point_id, scheduled_date, status)
                VALUES (v_point.point_id, v_date, 'pendiente')
                ON CONFLICT DO NOTHING;
            ELSIF v_point.freq_days = 7 AND v_day_of_week = 1 THEN
                -- Semanal: solo lunes
                INSERT INTO tasks (lubrication_point_id, scheduled_date, status)
                VALUES (v_point.point_id, v_date, 'pendiente')
                ON CONFLICT DO NOTHING;
            ELSIF v_point.freq_days = 30 AND v_day_of_month = 1 THEN
                -- Mensual: primer día del mes
                INSERT INTO tasks (lubrication_point_id, scheduled_date, status)
                VALUES (v_point.point_id, v_date, 'pendiente')
                ON CONFLICT DO NOTHING;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Agregar constraint único para evitar duplicados
ALTER TABLE tasks ADD CONSTRAINT unique_task_point_date 
    UNIQUE (lubrication_point_id, scheduled_date);

-- CREAR USUARIO ADMIN POR DEFECTO
-- (Este se crea automáticamente cuando te registras en Supabase Auth)
-- Luego puedes cambiar el rol a 'admin' manualmente:
-- UPDATE profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';

SELECT 'Datos AISA cargados exitosamente' as resultado;
SELECT COUNT(*) as total_puntos FROM lubrication_points;
SELECT COUNT(*) as tareas_generadas FROM tasks;
