import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiBookingService } from '../../../core/services/api-booking.service';
import { BookingItem } from '../../../core/models/booking.models';

@Component({
  selector: 'app-patient-history-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-history-page.html',
  styleUrl: './patient-history-page.css'
})
export class PatientHistoryPage implements OnInit {
  searchTerm = '';
  selectedStatus = 'all';
  isLoading = false;
  errorMessage = '';

  statusOptions = [
    'all',
    'Pending',
    'Confirmed',
    'Completed',
    'Cancelled',
    'No Show'
  ];

  historyItems: BookingItem[] = [];

  constructor(private apiBookingService: ApiBookingService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiBookingService.getMyBookings().subscribe({
      next: (response) => {
        this.historyItems = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load patient history.';
        this.isLoading = false;
      }
    });
  }

  get filteredHistory(): BookingItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.historyItems.filter(item => {
      const matchesSearch =
        !term ||
        item.service_name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term) ||
        (item.queue_number || '').toLowerCase().includes(term) ||
        (item.notes || '').toLowerCase().includes(term);

      const matchesStatus =
        this.selectedStatus === 'all' || item.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  formatTime(value: string | null): string {
    if (!value) return '—';
    return value.slice(0, 5);
  }
}