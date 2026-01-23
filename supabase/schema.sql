-- ============================================================
-- SUPABASE DATABASE SCHEMA
-- Sistema de Gestión de Lubricación Industrial - AISA
-- Enterprise-Grade Implementation
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Plantas (Production Lines)
CREATE TABLE plants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Áreas
CREATE TABLE areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Máquinas
CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area_id UUID NOT NULL REFERENCES areas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    make TEXT,
    model TEXT,
    serial_number TEXT,
    install_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Componentes
CREATE TABLE components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lubricantes
CREATE TABLE lubricants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('aceite', 'grasa')),
    brand TEXT,
    viscosity TEXT,
    nlgi_grade TEXT,
    unit_price DECIMAL(10,2),
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Frecuencias
CREATE TABLE frequencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    days INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Puntos de Lubricación
CREATE TABLE lubrication_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component_id UUID NOT NULL REFERENCES components(id) ON DELETE CASCADE,
    lubricant_id UUID NOT NULL REFERENCES lubricants(id),
    frequency_id UUID NOT NULL REFERENCES frequencies(id),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    method TEXT DEFAULT 'manual' CHECK (method IN ('manual', 'centralizado', 'automatico')),
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit TEXT DEFAULT 'ml' CHECK (unit IN ('ml', 'g', 'L', 'kg')),
    access_notes TEXT,
    safety_notes TEXT,
    photo_required BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Perfiles de Usuario (extendiendo auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'tecnico' CHECK (role IN ('admin', 'supervisor', 'tecnico')),
    company TEXT,
    phone TEXT,
    avatar_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Órdenes de Trabajo
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE,
    scheduled_date DATE NOT NULL,
    status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_progreso', 'completado', 'incompleto')),
    assigned_to UUID REFERENCES profiles(id),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    signature_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Tareas
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    lubrication_point_id UUID NOT NULL REFERENCES lubrication_points(id),
    status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'completado', 'omitido')),
    quantity_used DECIMAL(10,2),
    photo_before_url TEXT,
    photo_after_url TEXT,
    observations TEXT,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anomalías
CREATE TABLE anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id),
    machine_id UUID REFERENCES machines(id),
    lubrication_point_id UUID REFERENCES lubrication_points(id),
    reported_by UUID NOT NULL REFERENCES profiles(id),
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('baja', 'media', 'alta', 'critica')),
    status TEXT DEFAULT 'abierta' CHECK (status IN ('abierta', 'en_revision', 'resuelta')),
    photo_urls TEXT[],
    resolution TEXT,
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log de Auditoría
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_areas_plant ON areas(plant_id);
CREATE INDEX idx_machines_area ON machines(area_id);
CREATE INDEX idx_components_machine ON components(machine_id);
CREATE INDEX idx_lubrication_points_component ON lubrication_points(component_id);
CREATE INDEX idx_work_orders_date ON work_orders(scheduled_date);
CREATE INDEX idx_work_orders_assigned ON work_orders(assigned_to);
CREATE INDEX idx_tasks_work_order ON tasks(work_order_id);
CREATE INDEX idx_tasks_point ON tasks(lubrication_point_id);
CREATE INDEX idx_anomalies_status ON anomalies(status);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE lubricants ENABLE ROW LEVEL SECURITY;
ALTER TABLE frequencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lubrication_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data
CREATE POLICY "Authenticated users can read" ON plants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read" ON areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read" ON machines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read" ON components FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read" ON lubricants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read" ON frequencies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read" ON lubrication_points FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read" ON work_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read" ON anomalies FOR SELECT TO authenticated USING (true);

-- Admin/Supervisor can insert and update
CREATE POLICY "Admin can manage plants" ON plants FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

CREATE POLICY "Admin can manage areas" ON areas FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

CREATE POLICY "Admin can manage machines" ON machines FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

CREATE POLICY "Admin can manage components" ON components FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

CREATE POLICY "Admin can manage lubricants" ON lubricants FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

CREATE POLICY "Admin can manage lubrication_points" ON lubrication_points FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

-- Technicians can update their own work
CREATE POLICY "Technicians can update assigned tasks" ON tasks FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM work_orders wo 
        WHERE wo.id = tasks.work_order_id AND wo.assigned_to = auth.uid()
    ));

CREATE POLICY "Anyone can create anomalies" ON anomalies FOR INSERT TO authenticated
    WITH CHECK (reported_by = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated
    USING (id = auth.uid());

-- Audit log - only insert allowed
CREATE POLICY "Insert audit log" ON audit_log FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER plants_updated_at BEFORE UPDATE ON plants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER areas_updated_at BEFORE UPDATE ON areas FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER machines_updated_at BEFORE UPDATE ON machines FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER components_updated_at BEFORE UPDATE ON components FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER lubricants_updated_at BEFORE UPDATE ON lubricants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER lubrication_points_updated_at BEFORE UPDATE ON lubrication_points FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate work order code
CREATE OR REPLACE FUNCTION generate_work_order_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.code = 'OT-' || TO_CHAR(NEW.scheduled_date, 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER work_orders_code BEFORE INSERT ON work_orders FOR EACH ROW EXECUTE FUNCTION generate_work_order_code();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'tecnico');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- CONTRACTOR MANAGEMENT (Enterprise Feature)
-- ============================================================

-- Empresas Contratistas
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    rut TEXT UNIQUE NOT NULL,           -- Chilean tax ID (e.g., 76.XXX.XXX-X)
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    address TEXT,
    contract_start DATE NOT NULL,
    contract_end DATE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    certifications TEXT[],              -- ISO 9001, ISO 14001, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contratos de Servicio
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
    plant_id UUID NOT NULL REFERENCES plants(id),
    code TEXT UNIQUE,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    value DECIMAL(15,2),                -- Contract value in CLP
    sla_compliance INTEGER DEFAULT 95, -- Target SLA percentage
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'terminated')),
    terms_url TEXT,                     -- URL to contract document
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Auditorías de Cumplimiento
CREATE TABLE compliance_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES contractors(id),
    auditor_id UUID NOT NULL REFERENCES profiles(id),
    audit_type TEXT NOT NULL CHECK (audit_type IN ('routine', 'compliance', 'incident', 'certification')),
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    result TEXT DEFAULT 'pending' CHECK (result IN ('passed', 'failed', 'conditional', 'pending')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    findings TEXT,
    corrective_actions TEXT,
    next_audit_date DATE,
    attachments TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consumo de Lubricantes (Tracking detallado)
CREATE TABLE lubricant_consumption (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lubricant_id UUID NOT NULL REFERENCES lubricants(id),
    work_order_id UUID NOT NULL REFERENCES work_orders(id),
    task_id UUID REFERENCES tasks(id),
    quantity_used DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2),
    recorded_by UUID NOT NULL REFERENCES profiles(id),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movimientos de Inventario
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lubricant_id UUID NOT NULL REFERENCES lubricants(id),
    movement_type TEXT NOT NULL CHECK (movement_type IN ('entrada', 'salida', 'ajuste')),
    quantity DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    reference TEXT,                     -- PO number, WO number, etc.
    recorded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPIs Mensuales
CREATE TABLE kpi_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period TEXT NOT NULL,               -- YYYY-MM format
    contractor_id UUID REFERENCES contractors(id),
    plant_id UUID REFERENCES plants(id),
    tasks_completed INTEGER DEFAULT 0,
    tasks_total INTEGER DEFAULT 0,
    compliance_rate DECIMAL(5,2) DEFAULT 0,
    avg_response_time DECIMAL(10,2) DEFAULT 0,  -- Hours
    anomalies_reported INTEGER DEFAULT 0,
    anomalies_resolved INTEGER DEFAULT 0,
    lubricant_cost DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(period, contractor_id, plant_id)
);

-- Indexes for contractor tables
CREATE INDEX idx_contractors_status ON contractors(status);
CREATE INDEX idx_contracts_contractor ON contracts(contractor_id);
CREATE INDEX idx_contracts_plant ON contracts(plant_id);
CREATE INDEX idx_audits_contractor ON compliance_audits(contractor_id);
CREATE INDEX idx_consumption_lubricant ON lubricant_consumption(lubricant_id);
CREATE INDEX idx_consumption_workorder ON lubricant_consumption(work_order_id);
CREATE INDEX idx_inventory_lubricant ON inventory_movements(lubricant_id);
CREATE INDEX idx_kpi_period ON kpi_metrics(period);

-- RLS for contractor tables
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE lubricant_consumption ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for contractor tables
CREATE POLICY "Authenticated users can read contractors" ON contractors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage contractors" ON contractors FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users can read contracts" ON contracts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage contracts" ON contracts FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users can read audits" ON compliance_audits FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Supervisor can manage audits" ON compliance_audits FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

CREATE POLICY "Authenticated users can read consumption" ON lubricant_consumption FOR SELECT TO authenticated USING (true);
CREATE POLICY "Technicians can insert consumption" ON lubricant_consumption FOR INSERT TO authenticated 
    WITH CHECK (recorded_by = auth.uid());

CREATE POLICY "Authenticated users can read inventory" ON inventory_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin/Supervisor can manage inventory" ON inventory_movements FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor')));

CREATE POLICY "Authenticated users can read KPIs" ON kpi_metrics FOR SELECT TO authenticated USING (true);

-- Trigger for contractors updated_at
CREATE TRIGGER contractors_updated_at BEFORE UPDATE ON contractors FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert default frequencies
INSERT INTO frequencies (name, days) VALUES
    ('Diario', 1),
    ('Semanal', 7),
    ('Quincenal', 14),
    ('Mensual', 30),
    ('Trimestral', 90),
    ('Semestral', 180),
    ('Anual', 365);

-- Insert sample contractor for demo
INSERT INTO contractors (name, rut, contact_name, contact_email, contact_phone, contract_start, contract_end, status, certifications) VALUES
    ('Lubricación Profesional Ltda.', '76.123.456-7', 'Juan Pérez', 'juan@lubricacion.cl', '+56 9 1234 5678', '2026-01-01', '2026-12-31', 'active', ARRAY['ISO 9001:2015', 'ISO 14001:2015']);
