import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { ApiBookingService } from '../../../core/services/api-booking.service';
import { ServiceItem } from '../../../core/models/service.models';
import { BookingItem } from '../../../core/models/booking.models';

@Component({
  selector: 'app-patient-booking-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-booking-page.html',
  styleUrl: './patient-booking-page.css'
})
export class PatientBookingPage implements OnInit {
  searchTerm = '';
  selectedServiceId: number | null = null;
  selectedDate = '';
  selectedTime = '';
  notes = '';

  bookingMessage = '';
  errorMessage = '';
  notificationMessage = 'Select a service on the left to auto-fill available schedule details.';
  isLoadingServices = false;
  isLoadingBookings = false;
  isSubmitting = false;

  services: ServiceItem[] = [];
  bookings: BookingItem[] = [];

  timeOptions = [
    '08:00:00',
    '08:30:00',
    '09:00:00',
    '09:30:00',
    '10:00:00',
    '10:30:00',
    '11:00:00',
    '11:30:00',
    '13:00:00',
    '13:30:00',
    '14:00:00',
    '14:30:00',
    '15:00:00',
    '15:30:00'
  ];

  constructor(
    private apiServiceService: ApiServiceService,
    private apiBookingService: ApiBookingService
  ) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadBookings();
  }

  loadServices(): void {
    this.isLoadingServices = true;

    this.apiServiceService.getServices().subscribe({
      next: (response) => {
        this.services = response.data.filter(item => item.status === 'Active');
        this.isLoadingServices = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load services.';
        this.isLoadingServices = false;
      }
    });
  }

  loadBookings(): void {
    this.isLoadingBookings = true;

    this.apiBookingService.getMyBookings().subscribe({
      next: (response) => {
        this.bookings = response.data;
        this.isLoadingBookings = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load bookings.';
        this.isLoadingBookings = false;
      }
    });
  }

  get filteredServices(): ServiceItem[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.services;
    }

    return this.services.filter(service =>
      service.service_name.toLowerCase().includes(term) ||
      service.category.toLowerCase().includes(term) ||
      (service.description || '').toLowerCase().includes(term)
    );
  }

  get selectedService(): ServiceItem | undefined {
    return this.services.find(service => service.id === this.selectedServiceId);
  }

  chooseService(serviceId: number): void {
    this.selectedServiceId = serviceId;
    this.bookingMessage = '';
    this.errorMessage = '';
    this.notes = '';

    const service = this.selectedService;
    if (service) {
      this.notificationMessage = `${service.service_name} selected. Available on ${service.available_days} from ${this.formatTime(service.start_time)} to ${this.formatTime(service.end_time)}.`;
    }
  }

  bookAppointment(): void {
    this.bookingMessage = '';
    this.errorMessage = '';

    if (!this.selectedService || !this.selectedDate || !this.selectedTime) {
      this.errorMessage = 'Please select a service, booking date, and time.';
      return;
    }

    this.isSubmitting = true;

    this.apiBookingService.createBooking({
      serviceId: this.selectedService.id,
      bookingDate: this.selectedDate,
      bookingTime: this.selectedTime,
      notes: this.notes
    }).subscribe({
      next: () => {
        this.bookingMessage = 'Appointment booked successfully.';
        this.notificationMessage = 'Your booking was submitted. Please monitor the booking status below.';
        this.selectedDate = '';
        this.selectedTime = '';
        this.notes = '';
        this.isSubmitting = false;
        this.loadBookings();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Booking failed.';
        this.notificationMessage = 'Booking could not be completed. Please review your selected schedule.';
        this.isSubmitting = false;
      }
    });
  }

  cancelBooking(booking: BookingItem): void {
    this.apiBookingService.cancelBooking(booking.id).subscribe({
      next: () => {
        this.notificationMessage = `Booking for ${booking.service_name} was cancelled.`;
        this.loadBookings();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to cancel booking.';
      }
    });
  }

  formatTime(value: string): string {
    if (!value) return '';
    return value.slice(0, 5);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}