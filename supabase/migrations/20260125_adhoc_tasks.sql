-- Migration: Enable Ad-Hoc Tasks
-- Date: 2026-01-25
-- Description: Allow tasks without a specific lubrication point (generic tasks) and give them a title.

-- 1. Add title column to tasks (for ad-hoc descriptions like "Cleaning Workshop")
ALTER TABLE tasks ADD COLUMN title TEXT;

-- 2. Make lubrication_point_id nullable (so we don't need a point for general tasks)
ALTER TABLE tasks ALTER COLUMN lubrication_point_id DROP NOT NULL;

-- 3. Add priority column for ad-hoc tasks
ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- 4. Create a specific Work Order type or status? 
-- No, we will reuse existing WOs or create "AdHoc" WOs.

-- 5. Add 'adhoc' status to work_orders to distinguish them from scheduled ones
ALTER TABLE work_orders ADD COLUMN type TEXT DEFAULT 'scheduled' CHECK (type IN ('scheduled', 'adhoc', 'corrective'));
