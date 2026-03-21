import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type QueueStatus = 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';

interface QueueItem {
  id: number;
  patientName: string;
  scheduledTime: string;
  service: string;
  date: string;
  status: QueueStatus;
}

@Component({
  selector: 'app-admin-patient-queue-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-patient-queue-page.html',
  styleUrl: './admin-patient-queue-page.css'
})
export class AdminPatientQueuePage {
  searchTerm = '';
  selectedService = 'all';
  selectedDate = '';
  lastUpdated = new Date().toLocaleTimeString();

  serviceOptions = [
    'all',
    'Vaccination',
    'Dental Care',
    'Maternal',
    'STD Test',
    'Animal Related / Anti-Rabies',
    'Laboratory Tests',
    'General Check Up',
    'Other'
  ];

  queueItems: QueueItem[] = [
    {
      id: 1,
      patientName: 'Juan Dela Cruz',
      scheduledTime: '08:30 AM',
      service: 'General Check Up',
      date: '2026-03-21',
      status: 'Waiting'
    },
    {
      id: 2,
      patientName: 'Maria Santos',
      scheduledTime: '09:00 AM',
      service: 'Vaccination',
      date: '2026-03-21',
      status: 'In Progress'
    },
    {
      id: 3,
      patientName: 'Ana Lopez',
      scheduledTime: '10:00 AM',
      service: 'Laboratory Tests',
      date: '2026-03-21',
      status: 'Completed'
    },
    {
      id: 4,
      patientName: 'Mark Reyes',
      scheduledTime: '10:30 AM',
      service: 'Dental Care',
      date: '2026-03-22',
      status: 'Waiting'
    },
    {
      id: 5,
      patientName: 'Liza Cruz',
      scheduledTime: '11:00 AM',
      service: 'Maternal',
      date: '2026-03-22',
      status: 'No Show'
    }
  ];

  get filteredQueue(): QueueItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.queueItems.filter(item => {
      const matchesSearch =
        !term ||
        item.patientName.toLowerCase().includes(term) ||
        item.service.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term);

      const matchesService =
        this.selectedService === 'all' || item.service === this.selectedService;

      const matchesDate =
        !this.selectedDate || item.date === this.selectedDate;

      return matchesSearch && matchesService && matchesDate;
    });
  }

  refreshQueue(): void {
    this.lastUpdated = new Date().toLocaleTimeString();
  }

  callPatient(item: QueueItem): void {
    if (item.status === 'Waiting') {
      item.status = 'In Progress';
    }
  }

  markInProgress(item: QueueItem): void {
    item.status = 'In Progress';
  }

  complete(item: QueueItem): void {
    item.status = 'Completed';
  }

  skip(item: QueueItem): void {
    item.status = 'No Show';
  }

  cancel(item: QueueItem): void {
    item.status = 'Cancelled';
  }

  getStatusClass(status: QueueStatus): string {
    return `status ${status.toLowerCase().replace(/\s+/g, '-')}`;
  }
}