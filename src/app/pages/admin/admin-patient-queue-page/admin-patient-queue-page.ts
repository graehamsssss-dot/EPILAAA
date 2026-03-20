import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type QueueStatus = 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';

@Component({
  selector: 'app-admin-patient-queue-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-patient-queue-page.html',
  styleUrl: './admin-patient-queue-page.css'
})
export class AdminPatientQueuePage {
  search = '';

  queue = [
    { patientName: 'Juan Dela Cruz', time: '08:30 AM', service: 'General Check Up', status: 'Waiting' as QueueStatus },
    { patientName: 'Maria Santos', time: '09:00 AM', service: 'Vaccination', status: 'In Progress' as QueueStatus },
    { patientName: 'Ana Lopez', time: '10:00 AM', service: 'Laboratory Tests', status: 'Completed' as QueueStatus },
    { patientName: 'Mark Reyes', time: '10:30 AM', service: 'Dental Care', status: 'Waiting' as QueueStatus }
  ];

  get filteredQueue() {
    const term = this.search.toLowerCase().trim();
    return this.queue.filter(item =>
      item.patientName.toLowerCase().includes(term) ||
      item.service.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  }

  setStatus(index: number, status: QueueStatus): void {
    this.filteredQueue[index].status = status;
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase().replace(/\s+/g, '-');
    return `badge ${s}`;
  }
}