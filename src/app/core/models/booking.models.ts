export interface BookingItem {
  id: number;
  service_name: string;
  category: string;
  booking_date: string;
  booking_time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'No Show';
  notes: string | null;
  queue_number: string | null;
  called_at: string | null;
  completed_at: string | null;
}

export interface CreateBookingPayload {
  serviceId: number;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}