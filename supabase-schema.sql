-- ============================================================
-- SCHEMA AISA LUBRICACIÓN - Sistema de Sincronización
-- EJECUTAR EN ORDEN - Paso a Paso
-- ============================================================

-- ============================================================
-- PASO 1: Crear tablas básicas
-- ============================================================

-- Tabla profiles (debe crearse primero)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    role VARCHAR(20) DEFAULT 'tecnico' CHECK (role IN ('admin', 'supervisor', 'tecnico')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla work_orders
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheduled_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_progreso', 'completado')),
    technician_id UUID,
    completed_at TIMESTAMP WITH TIME ZONE,
    signature_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
    lubrication_point_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_progreso', 'completado', 'omitido')),
    quantity_used DECIMAL(10,2),
    observations TEXT,
    photo_url TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla anomalies
CREATE TABLE IF NOT EXISTS anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id),
    lubrication_point_id VARCHAR(50),
    machine_id VARCHAR(50),
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'media' CHECK (severity IN ('baja', 'media', 'alta', 'critica')),
    status VARCHAR(20) DEFAULT 'abierta' CHECK (status IN ('abierta', 'en_revision', 'resuelta')),
    photo_url TEXT,
    reported_by UUID,
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PASO 2: Crear índices
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_work_orders_date ON work_orders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_work_orders_technician ON work_orders(technician_id);
CREATE INDEX IF NOT EXISTS idx_tasks_work_order ON tasks(work_order_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_anomalies_status ON anomalies(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================
-- PASO 3: Habilitar RLS (Row Level Security)
-- ============================================================
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PASO 4: Políticas de acceso público (para desarrollo)
-- ============================================================

-- Work Orders - Acceso público para leer y modificar
CREATE POLICY "Allow all access to work_orders" ON work_orders FOR ALL USING (true) WITH CHECK (true);

-- Tasks - Acceso público
CREATE POLICY "Allow all access to tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

-- Profiles - Acceso público
CREATE POLICY "Allow all access to profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Anomalies - Acceso público
CREATE POLICY "Allow all access to anomalies" ON anomalies FOR ALL USING (true) WITH CHECK (true);

-- Audit Logs - Acceso público
CREATE POLICY "Allow all access to audit_logs" ON audit_logs FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- PASO 5: Función para updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS update_work_orders_updated_at ON work_orders;
CREATE TRIGGER update_work_orders_updated_at
    BEFORE UPDATE ON work_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- PASO 6: Habilitar Realtime
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'work_orders') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE work_orders;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'tasks') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'anomalies') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE anomalies;
    END IF;
END $$;
