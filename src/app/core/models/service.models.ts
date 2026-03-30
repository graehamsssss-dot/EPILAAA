export interface ServiceItem {
  id: number;
  service_name: string;
  category: string;
  description: string | null;
  available_days: string;
  start_time: string;
  end_time: string;
  slot_limit: number;
  status: 'Active' | 'Inactive';
  linked_inventory_items: string | null;
  created_at: string;
  updated_at: string;
}