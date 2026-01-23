-- ============================================================
-- SETUP SIMPLIFICADO PARA AISA LUBRICACIÓN
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. TABLAS BÁSICAS
-- ============================================================

-- Perfiles de usuario (extiende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'tecnico' CHECK (role IN ('admin', 'supervisor', 'tecnico')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plantas
CREATE TABLE IF NOT EXISTS plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Áreas
CREATE TABLE IF NOT EXISTS areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Máquinas
CREATE TABLE IF NOT EXISTS machines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_id UUID REFERENCES areas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Componentes
CREATE TABLE IF NOT EXISTS components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lubricantes
CREATE TABLE IF NOT EXISTS lubricants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('aceite', 'grasa')),
    unit TEXT DEFAULT 'ml',
    stock DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Frecuencias
CREATE TABLE IF NOT EXISTS frequencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    days INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Puntos de Lubricación
CREATE TABLE IF NOT EXISTS lubrication_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id UUID REFERENCES components(id) ON DELETE CASCADE,
    lubricant_id UUID REFERENCES lubricants(id),
    frequency_id UUID REFERENCES frequencies(id),
    code TEXT NOT NULL,
    description TEXT,
    method TEXT DEFAULT 'manual',
    quantity DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tareas
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lubrication_point_id UUID REFERENCES lubrication_points(id),
    scheduled_date DATE NOT NULL,
    status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'completado', 'omitido')),
    quantity_used DECIMAL(10,2),
    photo_url TEXT,
    observations TEXT,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anomalías
CREATE TABLE IF NOT EXISTS anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id),
    lubrication_point_id UUID REFERENCES lubrication_points(id),
    reported_by UUID REFERENCES profiles(id),
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('baja', 'media', 'alta', 'critica')),
    status TEXT DEFAULT 'abierta' CHECK (status IN ('abierta', 'en_revision', 'resuelta')),
    photo_url TEXT,
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE lubricants ENABLE ROW LEVEL SECURITY;
ALTER TABLE frequencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lubrication_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;

-- Permitir lectura a usuarios autenticados
CREATE POLICY "read_all" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_all" ON plants FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_all" ON areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_all" ON machines FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_all" ON components FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_all" ON lubricants FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_all" ON frequencies FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_all" ON lubrication_points FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_all" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_all" ON anomalies FOR SELECT TO authenticated USING (true);

-- Permitir insertar/actualizar a usuarios autenticados
CREATE POLICY "insert_all" ON tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_all" ON tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "insert_all" ON anomalies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_all" ON anomalies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "insert_all" ON profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_all" ON profiles FOR UPDATE TO authenticated USING (true);

-- Admins pueden todo
CREATE POLICY "admin_all" ON plants FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_all" ON areas FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_all" ON machines FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_all" ON components FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_all" ON lubricants FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_all" ON frequencies FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_all" ON lubrication_points FOR ALL TO authenticated USING (true);

-- 3. TRIGGER PARA CREAR PERFIL AL REGISTRARSE
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        'tecnico'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. DATOS INICIALES DE AISA
-- ============================================================

-- Frecuencias
INSERT INTO frequencies (name, days) VALUES
    ('Diario', 1),
    ('Cada 2 días', 2),
    ('Semanal', 7),
    ('Quincenal', 14),
    ('Mensual', 30),
    ('Trimestral', 90),
    ('Semestral', 180),
    ('Anual', 365)
ON CONFLICT DO NOTHING;

-- Lubricantes
INSERT INTO lubricants (name, type, unit, stock) VALUES
    ('Aceite Mobil DTE 10 Excel 150', 'aceite', 'ml', 20000),
    ('Grasa Mobilux EP 2', 'grasa', 'g', 5000),
    ('Aceite Mobil SHC 630', 'aceite', 'ml', 15000),
    ('Grasa SKF LGMT 2', 'grasa', 'g', 3000),
    ('Aceite Kluber NBU 15', 'aceite', 'ml', 10000),
    ('Grasa Molykote G-0102', 'grasa', 'g', 2000)
ON CONFLICT DO NOTHING;

-- Planta AISA
INSERT INTO plants (id, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'AISA Aserraderos')
ON CONFLICT DO NOTHING;

-- Áreas
INSERT INTO areas (id, plant_id, name) VALUES
    ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111111', 'Línea Gruesa'),
    ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111111', 'Línea Media'),
    ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111111', 'WD System')
ON CONFLICT DO NOTHING;

-- Máquinas Línea Gruesa
INSERT INTO machines (id, area_id, name) VALUES
    ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'Descortezador'),
    ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'Carro Porta Trozos'),
    ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', 'Sierra Huincha Principal'),
    ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222201', 'Volteador de Trozos'),
    ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222201', 'Mesa de Alimentación'),
    ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222202', 'Sierra Múltiple'),
    ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222202', 'Canteadora'),
    ('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222203', 'Sistema Hidráulico WD')
ON CONFLICT DO NOTHING;

-- 5. STORAGE PARA FOTOS
-- ============================================================

-- Crear bucket para fotos (ejecutar en Storage settings de Supabase)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);
