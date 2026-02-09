export interface WorkOrder {
  id: string;
  company_id: string;
  route_id: string | null;
  assigned_to: string | null;
  assigned_by: string | null;
  scheduled_date: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'incomplete' | 'cancelled' | null;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  completion_percentage: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  route_name?: string;
  assigned_to_name?: string;
  assigned_by_name?: string;
}

export interface TaskExecution {
  id: string;
  work_order_id: string;
  lubrication_point_id: string;
  executed_by: string | null;
  status: 'completed' | 'skipped' | 'issue_reported' | null;
  executed_at: string | null;
  lubricant_used_ml: number | null;
  duration_seconds: number | null;
  notes: string | null;
  photo_urls: string[] | null;
  geolocation: unknown | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  point_name?: string;
  point_code?: string;
  machine_name?: string;
}
