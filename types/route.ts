export interface Route {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  estimated_duration_min: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  points_count?: number;
}

export interface RoutePoint {
  id: string;
  route_id: string;
  lubrication_point_id: string;
  order_index: number;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  point_name?: string;
  point_code?: string;
  machine_name?: string;
}
