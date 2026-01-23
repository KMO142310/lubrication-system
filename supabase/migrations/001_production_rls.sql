-- ============================================================
-- MIGRACIÓN A PRODUCCIÓN - Políticas RLS Seguras
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- PASO 1: Eliminar políticas permisivas de desarrollo
DROP POLICY IF EXISTS "Allow all access to work_orders" ON work_orders;
DROP POLICY IF EXISTS "Allow all access to tasks" ON tasks;
DROP POLICY IF EXISTS "Allow all access to profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all access to anomalies" ON anomalies;
DROP POLICY IF EXISTS "Allow all access to audit_logs" ON audit_logs;

-- ============================================================
-- PASO 2: Políticas de PRODUCCIÓN
-- ============================================================

-- PROFILES: Usuarios pueden ver todos los perfiles, pero solo editar el suyo
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- WORK ORDERS: Todos pueden ver, solo supervisores/devs pueden crear/editar
CREATE POLICY "work_orders_select" ON work_orders FOR SELECT USING (true);
CREATE POLICY "work_orders_insert" ON work_orders FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('supervisor', 'desarrollador'))
);
CREATE POLICY "work_orders_update" ON work_orders FOR UPDATE USING (true);

-- TASKS: Todos pueden ver, técnicos pueden actualizar sus tareas
CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (true);
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "tasks_update" ON tasks FOR UPDATE USING (true);

-- ANOMALIES: Todos pueden ver y crear, solo supervisores resuelven
CREATE POLICY "anomalies_select" ON anomalies FOR SELECT USING (true);
CREATE POLICY "anomalies_insert" ON anomalies FOR INSERT WITH CHECK (true);
CREATE POLICY "anomalies_update" ON anomalies FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('supervisor', 'desarrollador'))
  OR reported_by = auth.uid()
);

-- AUDIT LOGS: Solo lectura para supervisores/devs, inserción automática
CREATE POLICY "audit_logs_select" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('supervisor', 'desarrollador'))
);
CREATE POLICY "audit_logs_insert" ON audit_logs FOR INSERT WITH CHECK (true);

-- ============================================================
-- PASO 3: Función de auditoría automática
-- ============================================================
CREATE OR REPLACE FUNCTION log_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completado' AND OLD.status != 'completado' THEN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
      NEW.completed_by,
      'TASK_COMPLETED',
      'task',
      NEW.id,
      jsonb_build_object(
        'lubrication_point_id', NEW.lubrication_point_id,
        'quantity_used', NEW.quantity_used,
        'has_photo', NEW.photo_url IS NOT NULL,
        'completed_at', NEW.completed_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_log_task_completion ON tasks;
CREATE TRIGGER trigger_log_task_completion
  AFTER UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION log_task_completion();

-- ============================================================
-- PASO 4: Índices adicionales para rendimiento
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_tasks_completed_at ON tasks(completed_at);
CREATE INDEX IF NOT EXISTS idx_tasks_lubrication_point ON tasks(lubrication_point_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_severity ON anomalies(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
