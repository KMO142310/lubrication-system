export interface Inventory {
  id: string;
  company_id: string;
  lubricant_type_id: string;
  current_stock_ml: number;
  minimum_stock_ml: number;
  location: string | null;
  last_restocked_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  lubricant_name?: string;
  lubricant_category?: string;
}

export interface InventoryMovement {
  id: string;
  inventory_id: string;
  type: 'entry' | 'consumption' | 'adjustment' | 'waste';
  quantity_ml: number;
  previous_stock_ml: number;
  new_stock_ml: number;
  performed_by: string | null;
  notes: string | null;
  created_at: string;
  performed_by_name?: string;
}
