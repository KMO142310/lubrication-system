export interface LubricantType {
  id: string;
  company_id: string;
  name: string;
  category: 'grease' | 'oil' | 'spray' | 'paste' | 'other' | null;
  viscosity: string | null;
  application: string | null;
  storage_temp_min: number | null;
  storage_temp_max: number | null;
  safety_data_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
