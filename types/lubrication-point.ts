export interface LubricationPoint {
  id: string;
  machine_id: string | null;
  name: string;
  code: string;
  lubricant_type_id: string | null;
  method: 'manual_grease' | 'oil_can' | 'automatic' | 'spray' | 'immersion' | null;
  quantity_ml: number;
  frequency_hours: number | null;
  frequency_type: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom' | null;
  location_description: string | null;
  image_url: string | null;
  safety_notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  machine_name?: string;
  lubricant_name?: string;
}
