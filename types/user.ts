export interface User {
  id: string;
  company_id: string;
  full_name: string;
  role: 'admin' | 'supervisor' | 'lubricator';
  rut: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  skills: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
