import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiAdminService } from '../../../core/services/api-admin.service';
import { QueueItem } from '../../../core/models/admin.models';

@Component({
  selector: 'app-admin-patient-queue-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-patient-queue-page.html',
  styleUrl: './admin-patient-queue-page.css'
})
export class AdminPatientQueuePage implements OnInit {
  queueItems: QueueItem[] = [];
  searchTerm = '';
  selectedDate = '';
  selectedService = '';
  isLoading = false;
  errorMessage = '';

  constructor(private apiAdminService: ApiAdminService) {}

  ngOnInit(): void {
    this.loadQueue();
  }

  loadQueue(): void {
    this.isLoading = true;

    this.apiAdminService.getQueue(this.selectedDate || undefined, this.selectedService || undefined).subscribe({
      next: (response) => {
        this.queueItems = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Failed to load queue.';
        this.isLoading = false;
      }
    });
  }

  get filteredQueue(): QueueItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) return this.queueItems;

    return this.queueItems.filter(item =>
      item.patient_name.toLowerCase().includes(term) ||
      item.service_name.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  }

  updateStatus(id: number, status: string): void {
    this.apiAdminService.updateQueueStatus(id, status).subscribe({
      next: () => this.loadQueue(),
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Failed to update queue status.';
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}