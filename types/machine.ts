export interface Machine {
  id: string;
  company_id: string;
  area_id: string | null;
  name: string;
  code: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  status: 'operational' | 'maintenance' | 'stopped' | null;
  criticality: 'critical' | 'important' | 'standard' | null;
  image_url: string | null;
  specs: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  area_name?: string;
}
