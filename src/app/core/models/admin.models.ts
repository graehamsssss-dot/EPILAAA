export interface DashboardSummary {
  patientsInQueue: number;
  lowStockItems: number;
  reports: number;
  completedToday: number;
}

export interface QueueItem {
  id: number;
  booking_id: number;
  queue_number: string | null;
  status: 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  booking_date: string;
  booking_time: string;
  service_name: string;
  patient_name: string;
}

export interface InventoryItem {
  id: number;
  item_name: string;
  linked_service: string;
  current_stock: number;
  low_stock_threshold: number;
  status: 'In Stock' | 'Low Stock' | 'Archived';
  created_at: string;
  updated_at: string;
}

export interface InventoryLogItem {
  id: number;
  item_name: string;
  action_type: 'Added' | 'Updated' | 'Restocked' | 'Used' | 'Archived';
  quantity: number;
  remarks: string | null;
  created_at: string;
}

export interface MonthlyReportItem {
  id: number;
  report_month: string;
  report_year: number;
  patient_count: number;
  service_count: number;
  queue_completion_rate: number;
  low_stock_summary: number;
  report_data: any;
  created_at: string;
  updated_at: string;
}

export interface DashboardPoint {
  label: string;
  value: number;
}

export interface DashboardAnalytics {
  selectedRange: string;
  monthlyConsultations: DashboardPoint[];
  serviceDistribution: DashboardPoint[];
  upcomingQueue: QueueItem[];
  reminders: string[];
  lowStockItems: {
    itemName: string;
    currentStock: number;
    lowStockThreshold: number;
  }[];
}