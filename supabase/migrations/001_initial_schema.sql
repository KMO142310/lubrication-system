-- =====================================================
-- BITACORA - Sistema de Control de Lubricación Industrial
-- Migración Inicial: Schema Completo
-- =====================================================

-- =====================================================
-- 1. ENUMS DEL SISTEMA
-- =====================================================

CREATE TYPE user_role AS ENUM ('admin', 'supervisor', 'lubricator');
CREATE TYPE machine_status AS ENUM ('operational', 'maintenance', 'stopped');
CREATE TYPE criticality_level AS ENUM ('critical', 'important', 'standard');
CREATE TYPE lubrication_method AS ENUM ('manual_grease', 'oil_can', 'automatic', 'spray', 'immersion');
CREATE TYPE frequency_type AS ENUM ('daily', 'weekly', 'biweekly', 'monthly', 'custom');
CREATE TYPE work_order_status AS ENUM ('pending', 'in_progress', 'completed', 'incomplete', 'cancelled');
CREATE TYPE task_status AS ENUM ('completed', 'skipped', 'issue_reported');
CREATE TYPE incident_type AS ENUM ('leak', 'damage', 'noise', 'temperature', 'vibration', 'contamination', 'missing_part', 'other');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status AS ENUM ('open', 'in_review', 'resolved', 'escalated');
CREATE TYPE movement_type AS ENUM ('entry', 'consumption', 'adjustment', 'waste');
CREATE TYPE reading_type AS ENUM ('temperature', 'vibration', 'noise', 'visual');
CREATE TYPE lubricant_category AS ENUM ('grease', 'oil', 'spray', 'paste', 'other');

-- =====================================================
-- 2. FUNCIÓN TRIGGER PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. TABLAS (en orden de dependencias)
-- =====================================================

-- 3.1 Tabla: companies
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rut TEXT UNIQUE,
  address TEXT,
  region TEXT,
  logo_url TEXT,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 3.2 Tabla: users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  full_name TEXT,
  role user_role NOT NULL,
  rut TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  skills JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- 3.3 Tabla: areas
CREATE TABLE areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER areas_updated_at
  BEFORE UPDATE ON areas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_areas_company_id ON areas(company_id);
CREATE INDEX idx_areas_order_index ON areas(order_index);

-- 3.4 Tabla: machines
CREATE TABLE machines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  name TEXT,
  code TEXT UNIQUE,
  brand TEXT,
  model TEXT,
  year INTEGER,
  status machine_status,
  criticality criticality_level,
  image_url TEXT,
  specs JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER machines_updated_at
  BEFORE UPDATE ON machines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_machines_company_id ON machines(company_id);
CREATE INDEX idx_machines_area_id ON machines(area_id);
CREATE INDEX idx_machines_status ON machines(status);
CREATE INDEX idx_machines_criticality ON machines(criticality);

-- 3.5 Tabla: lubricant_types
CREATE TABLE lubricant_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT,
  category lubricant_category,
  viscosity TEXT,
  application TEXT,
  storage_temp_min DECIMAL,
  storage_temp_max DECIMAL,
  safety_data_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER lubricant_types_updated_at
  BEFORE UPDATE ON lubricant_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_lubricant_types_company_id ON lubricant_types(company_id);
CREATE INDEX idx_lubricant_types_category ON lubricant_types(category);

-- 3.6 Tabla: lubrication_points
CREATE TABLE lubrication_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
  name TEXT,
  code TEXT,
  lubricant_type_id UUID REFERENCES lubricant_types(id) ON DELETE SET NULL,
  method lubrication_method,
  quantity_ml DECIMAL,
  frequency_hours INTEGER,
  frequency_type frequency_type,
  location_description TEXT,
  image_url TEXT,
  safety_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER lubrication_points_updated_at
  BEFORE UPDATE ON lubrication_points
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_lubrication_points_machine_id ON lubrication_points(machine_id);
CREATE INDEX idx_lubrication_points_lubricant_type_id ON lubrication_points(lubricant_type_id);
CREATE INDEX idx_lubrication_points_is_active ON lubrication_points(is_active);
CREATE INDEX idx_lubrication_points_frequency_type ON lubrication_points(frequency_type);

-- 3.7 Tabla: routes
CREATE TABLE routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  estimated_duration_min INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_routes_company_id ON routes(company_id);
CREATE INDEX idx_routes_is_active ON routes(is_active);

-- 3.8 Tabla: route_points
CREATE TABLE route_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  lubrication_point_id UUID NOT NULL REFERENCES lubrication_points(id) ON DELETE CASCADE,
  order_index INTEGER,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER route_points_updated_at
  BEFORE UPDATE ON route_points
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_route_points_route_id ON route_points(route_id);
CREATE INDEX idx_route_points_lubrication_point_id ON route_points(lubrication_point_id);
CREATE INDEX idx_route_points_order_index ON route_points(order_index);

-- 3.9 Tabla: work_orders
CREATE TABLE work_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  scheduled_date DATE,
  status work_order_status DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  completion_percentage DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER work_orders_updated_at
  BEFORE UPDATE ON work_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_work_orders_company_id ON work_orders(company_id);
CREATE INDEX idx_work_orders_route_id ON work_orders(route_id);
CREATE INDEX idx_work_orders_assigned_to ON work_orders(assigned_to);
CREATE INDEX idx_work_orders_assigned_by ON work_orders(assigned_by);
CREATE INDEX idx_work_orders_scheduled_date ON work_orders(scheduled_date);
CREATE INDEX idx_work_orders_status ON work_orders(status);

-- 3.10 Tabla: task_executions
CREATE TABLE task_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
  lubrication_point_id UUID NOT NULL REFERENCES lubrication_points(id) ON DELETE CASCADE,
  executed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status task_status,
  executed_at TIMESTAMPTZ,
  lubricant_used_ml DECIMAL,
  duration_seconds INTEGER,
  notes TEXT,
  photo_urls TEXT[],
  geolocation POINT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER task_executions_updated_at
  BEFORE UPDATE ON task_executions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_task_executions_work_order_id ON task_executions(work_order_id);
CREATE INDEX idx_task_executions_lubrication_point_id ON task_executions(lubrication_point_id);
CREATE INDEX idx_task_executions_executed_by ON task_executions(executed_by);
CREATE INDEX idx_task_executions_status ON task_executions(status);
CREATE INDEX idx_task_executions_executed_at ON task_executions(executed_at);

-- 3.11 Tabla: incidents
CREATE TABLE incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  task_execution_id UUID REFERENCES task_executions(id) ON DELETE SET NULL,
  lubrication_point_id UUID REFERENCES lubrication_points(id) ON DELETE CASCADE,
  reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
  type incident_type,
  severity severity_level,
  description TEXT,
  photo_urls TEXT[],
  status incident_status DEFAULT 'open',
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_incidents_company_id ON incidents(company_id);
CREATE INDEX idx_incidents_task_execution_id ON incidents(task_execution_id);
CREATE INDEX idx_incidents_lubrication_point_id ON incidents(lubrication_point_id);
CREATE INDEX idx_incidents_reported_by ON incidents(reported_by);
CREATE INDEX idx_incidents_type ON incidents(type);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_status ON incidents(status);

-- 3.12 Tabla: inventory
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  lubricant_type_id UUID NOT NULL REFERENCES lubricant_types(id) ON DELETE CASCADE,
  current_stock_ml DECIMAL,
  minimum_stock_ml DECIMAL,
  location TEXT,
  last_refill_date DATE,
  batch_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_inventory_company_id ON inventory(company_id);
CREATE INDEX idx_inventory_lubricant_type_id ON inventory(lubricant_type_id);

-- 3.13 Tabla: inventory_movements
CREATE TABLE inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  type movement_type,
  quantity_ml DECIMAL,
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER inventory_movements_updated_at
  BEFORE UPDATE ON inventory_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_inventory_movements_inventory_id ON inventory_movements(inventory_id);
CREATE INDEX idx_inventory_movements_performed_by ON inventory_movements(performed_by);
CREATE INDEX idx_inventory_movements_work_order_id ON inventory_movements(work_order_id);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(type);

-- 3.14 Tabla: readings
CREATE TABLE readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lubrication_point_id UUID NOT NULL REFERENCES lubrication_points(id) ON DELETE CASCADE,
  task_execution_id UUID REFERENCES task_executions(id) ON DELETE SET NULL,
  reading_type reading_type,
  value DECIMAL,
  unit TEXT,
  is_anomaly BOOLEAN DEFAULT false,
  recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER readings_updated_at
  BEFORE UPDATE ON readings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_readings_lubrication_point_id ON readings(lubrication_point_id);
CREATE INDEX idx_readings_task_execution_id ON readings(task_execution_id);
CREATE INDEX idx_readings_recorded_by ON readings(recorded_by);
CREATE INDEX idx_readings_reading_type ON readings(reading_type);
CREATE INDEX idx_readings_is_anomaly ON readings(is_anomaly);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activar RLS en todas las tablas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE lubricant_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE lubrication_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. POLÍTICAS RLS (filtrado por company_id)
-- =====================================================

-- Helper function para obtener company_id del usuario autenticado
CREATE OR REPLACE FUNCTION auth.user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Políticas para companies
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (id = auth.user_company_id());

CREATE POLICY "Users can update their own company"
  ON companies FOR UPDATE
  USING (id = auth.user_company_id());

-- Políticas para users
CREATE POLICY "Users can view users from their company"
  ON users FOR SELECT
  USING (company_id = auth.user_company_id());

CREATE POLICY "Users can insert users to their company"
  ON users FOR INSERT
  WITH CHECK (company_id = auth.user_company_id());

CREATE POLICY "Users can update users from their company"
  ON users FOR UPDATE
  USING (company_id = auth.user_company_id());

-- Políticas para areas
CREATE POLICY "Users can view areas from their company"
  ON areas FOR SELECT
  USING (company_id = auth.user_company_id());

CREATE POLICY "Users can insert areas to their company"
  ON areas FOR INSERT
  WITH CHECK (company_id = auth.user_company_id());

CREATE POLICY "Users can update areas from their company"
  ON areas FOR UPDATE
  USING (company_id = auth.user_company_id());

-- Políticas para machines
CREATE POLICY "Users can view machines from their company"
  ON machines FOR SELECT
  USING (company_id = auth.user_company_id());

CREATE POLICY "Users can insert machines to their company"
  ON machines FOR INSERT
  WITH CHECK (company_id = auth.user_company_id());

CREATE POLICY "Users can update machines from their company"
  ON machines FOR UPDATE
  USING (company_id = auth.user_company_id());

-- Políticas para lubricant_types
CREATE POLICY "Users can view lubricant_types from their company"
  ON lubricant_types FOR SELECT
  USING (company_id = auth.user_company_id());

CREATE POLICY "Users can insert lubricant_types to their company"
  ON lubricant_types FOR INSERT
  WITH CHECK (company_id = auth.user_company_id());

CREATE POLICY "Users can update lubricant_types from their company"
  ON lubricant_types FOR UPDATE
  USING (company_id = auth.user_company_id());

-- Políticas para lubrication_points (a través de machine)
CREATE POLICY "Users can view lubrication_points from their company"
  ON lubrication_points FOR SELECT
  USING (
    machine_id IN (
      SELECT id FROM machines WHERE company_id = auth.user_company_id()
    )
  );

CREATE POLICY "Users can insert lubrication_points to their company"
  ON lubrication_points FOR INSERT
  WITH CHECK (
    machine_id IN (
      SELECT id FROM machines WHERE company_id = auth.user_company_id()
    )
  );

CREATE POLICY "Users can update lubrication_points from their company"
  ON lubrication_points FOR UPDATE
  USING (
    machine_id IN (
      SELECT id FROM machines WHERE company_id = auth.user_company_id()
    )
  );

-- Políticas para routes
CREATE POLICY "Users can view routes from their company"
  ON routes FOR SELECT
  USING (company_id = auth.user_company_id());

CREATE POLICY "Users can insert routes to their company"
  ON routes FOR INSERT
  WITH CHECK (company_id = auth.user_company_id());

CREATE POLICY "Users can update routes from their company"
  ON routes FOR UPDATE
  USING (company_id = auth.user_company_id());

-- Políticas para route_points (a través de route)
CREATE POLICY "Users can view route_points from their company"
  ON route_points FOR SELECT
  USING (
    route_id IN (
      SELECT id FROM routes WHERE company_id = auth.user_company_id()
    )
  );

CREATE POLICY "Users can insert route_points to their company"
  ON route_points FOR INSERT
  WITH CHECK (
    route_id IN (
      SELECT id FROM routes WHERE company_id = auth.user_company_id()
    )
  );

CREATE POLICY "Users can update route_points from their company"
  ON route_points FOR UPDATE
  USING (
    route_id IN (
      SELECT id FROM routes WHERE company_id = auth.user_company_id()
    )
  );

-- Políticas para work_orders
CREATE POLICY "Users can view work_orders from their company"
  ON work_orders FOR SELECT
  USING (company_id = auth.user_company_id());

CREATE POLICY "Users can insert work_orders to their company"
  ON work_orders FOR INSERT
  WITH CHECK (company_id = auth.user_company_id());

CREATE POLICY "Users can update work_orders from their company"
  ON work_orders FOR UPDATE
  USING (company_id = auth.user_company_id());

-- Políticas para task_executions (a través de work_order)
CREATE POLICY "Users can view task_executions from their company"
  ON task_executions FOR SELECT
  USING (
    work_order_id IN (
      SELECT id FROM work_orders WHERE company_id = auth.user_company_id()
    )
  );

CREATE POLICY "Users can insert task_executions to their company"
  ON task_executions FOR INSERT
  WITH CHECK (
    work_order_id IN (
      SELECT id FROM work_orders WHERE company_id = auth.user_company_id()
    )
  );

CREATE POLICY "Users can update task_executions from their company"
  ON task_executions FOR UPDATE
  USING (
    work_order_id IN (
      SELECT id FROM work_orders WHERE company_id = auth.user_company_id()
    )
  );

-- Políticas para incidents
CREATE POLICY "Users can view incidents from their company"
  ON incidents FOR SELECT
  USING (company_id = auth.user_company_id());

CREATE POLICY "Users can insert incidents to their company"
  ON incidents FOR INSERT
  WITH CHECK (company_id = auth.user_company_id());

CREATE POLICY "Users can update incidents from their company"
  ON incidents FOR UPDATE
  USING (company_id = auth.user_company_id());

-- Políticas para inventory
CREATE POLICY "Users can view inventory from their company"
  ON inventory FOR SELECT
  USING (company_id = auth.user_company_id());

CREATE POLICY "Users can insert inventory to their company"
  ON inventory FOR INSERT
  WITH CHECK (company_id = auth.user_company_id());

CREATE POLICY "Users can update inventory from their company"
  ON inventory FOR UPDATE
  USING (company_id = auth.user_company_id());

-- Políticas para inventory_movements (a través de inventory)
CREATE POLICY "Users can view inventory_movements from their company"
  ON inventory_movements FOR SELECT
  USING (
    inventory_id IN (
      SELECT id FROM inventory WHERE company_id = auth.user_company_id()
    )
  );

CREATE POLICY "Users can insert inventory_movements to their company"
  ON inventory_movements FOR INSERT
  WITH CHECK (
    inventory_id IN (
      SELECT id FROM inventory WHERE company_id = auth.user_company_id()
    )
  );

CREATE POLICY "Users can update inventory_movements from their company"
  ON inventory_movements FOR UPDATE
  USING (
    inventory_id IN (
      SELECT id FROM inventory WHERE company_id = auth.user_company_id()
    )
  );

-- Políticas para readings (a través de lubrication_point)
CREATE POLICY "Users can view readings from their company"
  ON readings FOR SELECT
  USING (
    lubrication_point_id IN (
      SELECT lp.id FROM lubrication_points lp
      JOIN machines m ON lp.machine_id = m.id
      WHERE m.company_id = auth.user_company_id()
    )
  );

CREATE POLICY "Users can insert readings to their company"
  ON readings FOR INSERT
  WITH CHECK (
    lubrication_point_id IN (
      SELECT lp.id FROM lubrication_points lp
      JOIN machines m ON lp.machine_id = m.id
      WHERE m.company_id = auth.user_company_id()
    )
  );

CREATE POLICY "Users can update readings from their company"
  ON readings FOR UPDATE
  USING (
    lubrication_point_id IN (
      SELECT lp.id FROM lubrication_points lp
      JOIN machines m ON lp.machine_id = m.id
      WHERE m.company_id = auth.user_company_id()
    )
  );
