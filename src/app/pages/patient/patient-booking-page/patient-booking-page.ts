import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ServiceOption {
  id: number;
  name: string;
  category: string;
  description: string;
  availableDays: string;
  startTime: string;
  endTime: string;
  slotsLeft: number;
  status: 'Available' | 'Unavailable';
}

interface BookingRecord {
  id: number;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

@Component({
  selector: 'app-patient-booking-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-booking-page.html',
  styleUrl: './patient-booking-page.css'
})
export class PatientBookingPage {
  searchTerm = '';
  selectedServiceId: number | null = null;
  selectedDate = '';
  selectedTime = '';
  bookingMessage = '';

  services: ServiceOption[] = [
    {
      id: 1,
      name: 'Vaccination',
      category: 'Vaccination',
      description: 'Routine and seasonal vaccines.',
      availableDays: 'Mon, Wed, Fri',
      startTime: '08:00 AM',
      endTime: '12:00 PM',
      slotsLeft: 12,
      status: 'Available'
    },
    {
      id: 2,
      name: 'Dental Care',
      category: 'Dental Care',
      description: 'Basic dental checkups and oral care.',
      availableDays: 'Tue, Thu',
      startTime: '09:00 AM',
      endTime: '03:00 PM',
      slotsLeft: 6,
      status: 'Available'
    },
    {
      id: 3,
      name: 'Laboratory Tests',
      category: 'Laboratory Tests',
      description: 'Urinary and blood-related laboratory services.',
      availableDays: 'Mon to Sat',
      startTime: '07:30 AM',
      endTime: '11:30 AM',
      slotsLeft: 0,
      status: 'Unavailable'
    },
    {
      id: 4,
      name: 'General Check Up',
      category: 'General Check Up',
      description: 'Routine medical consultation and assessment.',
      availableDays: 'Mon to Sat',
      startTime: '08:00 AM',
      endTime: '04:00 PM',
      slotsLeft: 15,
      status: 'Available'
    }
  ];

  bookings: BookingRecord[] = [
    {
      id: 1,
      serviceName: 'Vaccination',
      bookingDate: '2026-03-24',
      bookingTime: '09:00 AM',
      status: 'Confirmed'
    },
    {
      id: 2,
      serviceName: 'Dental Care',
      bookingDate: '2026-03-26',
      bookingTime: '10:30 AM',
      status: 'Pending'
    }
  ];

  timeOptions = [
    '08:00 AM',
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM'
  ];

  get filteredServices(): ServiceOption[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.services;
    }

    return this.services.filter(service =>
      service.name.toLowerCase().includes(term) ||
      service.category.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term)
    );
  }

  get selectedService(): ServiceOption | undefined {
    return this.services.find(service => service.id === this.selectedServiceId);
  }

  chooseService(serviceId: number): void {
    this.selectedServiceId = serviceId;
    this.bookingMessage = '';
  }

  bookAppointment(): void {
    if (!this.selectedService || !this.selectedDate || !this.selectedTime) {
      this.bookingMessage = 'Please select a service, date, and time.';
      return;
    }

    if (this.selectedService.status !== 'Available' || this.selectedService.slotsLeft <= 0) {
      this.bookingMessage = 'Selected service currently has no available slots.';
      return;
    }

    this.bookings.unshift({
      id: Date.now(),
      serviceName: this.selectedService.name,
      bookingDate: this.selectedDate,
      bookingTime: this.selectedTime,
      status: 'Pending'
    });

    this.selectedService.slotsLeft -= 1;
    if (this.selectedService.slotsLeft <= 0) {
      this.selectedService.status = 'Unavailable';
    }

    this.bookingMessage = 'Appointment booked successfully.';
    this.selectedDate = '';
    this.selectedTime = '';
  }

  cancelBooking(booking: BookingRecord): void {
    if (booking.status === 'Cancelled') {
      return;
    }

    booking.status = 'Cancelled';

    const service = this.services.find(item => item.name === booking.serviceName);
    if (service) {
      service.slotsLeft += 1;
      service.status = 'Available';
    }
  }

  getServiceStatusClass(status: string): string {
    return `status ${status.toLowerCase()}`;
  }

  getBookingStatusClass(status: string): string {
    return `status ${status.toLowerCase()}`;
  }
}