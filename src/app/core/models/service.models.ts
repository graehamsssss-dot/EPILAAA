export interface ServiceItem {
  id: number;
  service_name: string;
  category: string;
  description: string | null;
  available_days: string;
  schedule_date: string | null;
  start_time: string;
  end_time: string;
  slot_limit: number;
  status: 'Active' | 'Inactive';
  linked_inventory_items: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceAvailabilitySlot {
  time: string;
  booked: number;
  slotLimit: number;
  remaining: number;
  available: boolean;
}

export interface ServiceAvailabilityData {
  serviceId: number;
  serviceName: string;
  date: string;
  slots: ServiceAvailabilitySlot[];
}