import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type HistoryStatus = 'Completed' | 'Cancelled' | 'No Show' | 'Confirmed' | 'Pending';

interface BookingHistoryItem {
  id: number;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  status: HistoryStatus;
}

interface CompletedServiceItem {
  id: number;
  serviceName: string;
  consultationDate: string;
  attendingStaff: string;
  remarks: string;
}

interface QueueHistoryItem {
  id: number;
  queueDate: string;
  queueNumber: string;
  serviceName: string;
  status: 'Completed' | 'Cancelled' | 'No Show';
}

@Component({
  selector: 'app-patient-history-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-history-page.html',
  styleUrl: './patient-history-page.css'
})
export class PatientHistoryPage {
  searchTerm = '';
  selectedSection = 'all';

  sectionOptions = [
    { label: 'All Records', value: 'all' },
    { label: 'Booking History', value: 'booking' },
    { label: 'Completed Services', value: 'completed' },
    { label: 'Queue History', value: 'queue' }
  ];

  bookingHistory: BookingHistoryItem[] = [
    {
      id: 1,
      serviceName: 'Vaccination',
      bookingDate: '2026-03-12',
      bookingTime: '09:00 AM',
      status: 'Completed'
    },
    {
      id: 2,
      serviceName: 'Dental Care',
      bookingDate: '2026-03-14',
      bookingTime: '10:30 AM',
      status: 'Cancelled'
    },
    {
      id: 3,
      serviceName: 'General Check Up',
      bookingDate: '2026-03-18',
      bookingTime: '08:30 AM',
      status: 'Confirmed'
    }
  ];

  completedServices: CompletedServiceItem[] = [
    {
      id: 1,
      serviceName: 'Vaccination',
      consultationDate: '2026-03-12',
      attendingStaff: 'Nurse Angela Cruz',
      remarks: 'Routine immunization completed successfully.'
    },
    {
      id: 2,
      serviceName: 'Laboratory Tests',
      consultationDate: '2026-02-28',
      attendingStaff: 'Med Tech Paulo Reyes',
      remarks: 'Blood chemistry requested and processed.'
    }
  ];

  queueHistory: QueueHistoryItem[] = [
    {
      id: 1,
      queueDate: '2026-03-12',
      queueNumber: 'A-014',
      serviceName: 'Vaccination',
      status: 'Completed'
    },
    {
      id: 2,
      queueDate: '2026-03-14',
      queueNumber: 'D-006',
      serviceName: 'Dental Care',
      status: 'Cancelled'
    },
    {
      id: 3,
      queueDate: '2026-02-28',
      queueNumber: 'L-021',
      serviceName: 'Laboratory Tests',
      status: 'Completed'
    }
  ];

  get filteredBookingHistory(): BookingHistoryItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.bookingHistory.filter(item =>
      !term ||
      item.serviceName.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.bookingDate.toLowerCase().includes(term)
    );
  }

  get filteredCompletedServices(): CompletedServiceItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.completedServices.filter(item =>
      !term ||
      item.serviceName.toLowerCase().includes(term) ||
      item.attendingStaff.toLowerCase().includes(term) ||
      item.consultationDate.toLowerCase().includes(term)
    );
  }

  get filteredQueueHistory(): QueueHistoryItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.queueHistory.filter(item =>
      !term ||
      item.serviceName.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.queueNumber.toLowerCase().includes(term) ||
      item.queueDate.toLowerCase().includes(term)
    );
  }

  getStatusClass(status: string): string {
    return `status ${status.toLowerCase().replace(/\s+/g, '-')}`;
  }

  showSection(section: string): boolean {
    return this.selectedSection === 'all' || this.selectedSection === section;
  }
}