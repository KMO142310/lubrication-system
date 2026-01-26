-- Migration: 20260126200000_multi_tenancy_v1
-- Description: Implement Multi-tenancy Architecture

-- 1. Create 'tenants' table (Organizations)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create helper to get current user's tenant_id
-- Assumes a 'profiles' table exists that links user_id to tenant_id
-- If 'profiles' does not exist yet as per schema, we need to create/alter it.
-- Based on plan, 'profiles' exists.

CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM profiles 
    WHERE id = auth.uid()
  );
END;
$$;

-- 3. Add 'tenant_id' to existing tables
-- We use a DO block to add column if it doesn't exist to multiple tables

DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'custom_access_tokens', -- If exists, usually not needed but good for audit
        'profiles',
        'work_orders', 
        'tasks', 
        'anomalies', 
        'audit_logs',
        -- Configuration tables (assuming they exist or are being created)
        -- If they don't exist, we skip. Based on plan, we might need to migrate data first.
        -- For this migration, we target the core entities known to be in Supabase.
        'plants', 
        'areas', 
        'machines', 
        'components', 
        'lubrication_points',
        'lubricants', 
        'frequencies'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        -- Check if table exists
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN
            -- Add tenant_id column if not exists
            IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = t AND column_name = 'tenant_id') THEN
                EXECUTE format('ALTER TABLE %I ADD COLUMN tenant_id UUID REFERENCES tenants(id);', t);
                EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_tenant_id ON %I(tenant_id);', t, t);
            END IF;
            
            -- Enable RLS
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
            
            -- Drop existing policies to avoid conflicts (optional, be careful)
            -- For this migration, we will create new tenant isolation policies
            
            -- Create Tenant Isolation Policy
            -- "Users can view rows belonging to their tenant"
            EXECUTE format('DROP POLICY IF EXISTS "Tenant Isolation Select" ON %I;', t);
            EXECUTE format('CREATE POLICY "Tenant Isolation Select" ON %I FOR SELECT USING (tenant_id = get_user_tenant_id());', t);
            
            EXECUTE format('DROP POLICY IF EXISTS "Tenant Isolation Insert" ON %I;', t);
            EXECUTE format('CREATE POLICY "Tenant Isolation Insert" ON %I FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());', t);
            
            EXECUTE format('DROP POLICY IF EXISTS "Tenant Isolation Update" ON %I;', t);
            EXECUTE format('CREATE POLICY "Tenant Isolation Update" ON %I FOR UPDATE USING (tenant_id = get_user_tenant_id());', t);
            
            EXECUTE format('DROP POLICY IF EXISTS "Tenant Isolation Delete" ON %I;', t);
            EXECUTE format('CREATE POLICY "Tenant Isolation Delete" ON %I FOR DELETE USING (tenant_id = get_user_tenant_id());', t);
        END IF;
    END LOOP;
END;
$$;

-- 4. RLS for 'tenants' table
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tenant" ON tenants
    FOR SELECT
    USING (id = get_user_tenant_id());

-- 5. Special handling for 'profiles' table
-- Users need to be able to read their own profile even without tenant context sometimes (e.g. initial load)
-- But usually strictly scoped.

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- 6. Insert Default Tenant for Migration (Optional but recommended)
INSERT INTO tenants (name, slug)
VALUES ('AISA Industrial', 'aisa')
ON CONFLICT (slug) DO NOTHING;

-- 7. Function to auto-assign tenant on insert (Trigger)
-- This ensures that if a user inserts data, it automatically gets tagged with their tenant_id
-- preventing accidental nulls or cross-tenant writes if the client forgets to send it.

CREATE OR REPLACE FUNCTION set_tenant_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := get_user_tenant_id();
  END IF;
  RETURN NEW;
END;
$$;

-- Apply trigger to all tables
DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'work_orders', 'tasks', 'anomalies', 
        'plants', 'areas', 'machines', 'components', 'lubrication_points'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN
            EXECUTE format('DROP TRIGGER IF EXISTS set_tenant_id_trigger ON %I;', t);
            EXECUTE format('CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON %I FOR EACH ROW EXECUTE FUNCTION set_tenant_id();', t);
        END IF;
    END LOOP;
END;
$$;
