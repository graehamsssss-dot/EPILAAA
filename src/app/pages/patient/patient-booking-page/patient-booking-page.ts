import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../core/services/api-service.service';
import { ApiBookingService } from '../../../core/services/api-booking.service';
import {
  ServiceAvailabilitySlot,
  ServiceItem
} from '../../../core/models/service.models';
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
  notificationMessage =
    'Select a service on the left to auto-fill available schedule details.';
  isLoadingServices = false;
  isLoadingBookings = false;
  isSubmitting = false;
  isLoadingAvailability = false;

  services: ServiceItem[] = [];
  bookings: BookingItem[] = [];
  availableSlots: ServiceAvailabilitySlot[] = [];

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
        this.services = response.data.filter((item) => item.status === 'Active');
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

    if (!term) return this.services;

    return this.services.filter(
      (service) =>
        service.service_name.toLowerCase().includes(term) ||
        service.category.toLowerCase().includes(term) ||
        (service.description || '').toLowerCase().includes(term)
    );
  }

  get selectedService(): ServiceItem | undefined {
    return this.services.find((service) => service.id === this.selectedServiceId);
  }

  get isFixedScheduleDate(): boolean {
    return !!this.selectedService?.schedule_date;
  }

  chooseService(serviceId: number): void {
    this.selectedServiceId = serviceId;
    this.selectedDate = '';
    this.selectedTime = '';
    this.notes = '';
    this.availableSlots = [];
    this.bookingMessage = '';
    this.errorMessage = '';

    const service = this.selectedService;

    if (service?.schedule_date) {
      this.selectedDate = service.schedule_date;
    }

    if (service) {
      this.notificationMessage = `${service.service_name} selected. Available on ${service.schedule_date || service.available_days} from ${this.formatTime(service.start_time)} to ${this.formatTime(service.end_time)}.`;
    }

    if (this.selectedDate) {
      this.onDateChange();
    }
  }

  onDateChange(): void {
    this.selectedTime = '';
    this.availableSlots = [];

    if (!this.selectedService || !this.selectedDate) return;

    if (!this.isSelectedDateValid()) {
      return;
    }

    this.loadAvailability();
  }

  loadAvailability(): void {
    if (!this.selectedService || !this.selectedDate) return;

    this.isLoadingAvailability = true;
    this.errorMessage = '';

    this.apiServiceService
      .getServiceAvailability(this.selectedService.id, this.selectedDate)
      .subscribe({
        next: (response) => {
          this.availableSlots = response.data.slots;
          this.isLoadingAvailability = false;

          const openSlots = this.availableSlots.filter((slot) => slot.available);
          if (!openSlots.length) {
            this.notificationMessage =
              'No available slots left for the selected date.';
          } else {
            this.notificationMessage =
              'Available slots loaded for the selected date.';
          }
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Failed to load slot availability.';
          this.isLoadingAvailability = false;
        }
      });
  }

  normalizeAvailableDays(days: string): string[] {
    const text = days.toLowerCase().trim();

    if (text.includes('mon to sat')) {
      return [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
      ];
    }

    if (text.includes('mon to fri')) {
      return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    }

    if (text.includes('daily')) {
      return [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
      ];
    }

    return text
      .split(',')
      .map((item) => item.trim())
      .map((item) => {
        if (item.startsWith('mon')) return 'monday';
        if (item.startsWith('tue')) return 'tuesday';
        if (item.startsWith('wed')) return 'wednesday';
        if (item.startsWith('thu')) return 'thursday';
        if (item.startsWith('fri')) return 'friday';
        if (item.startsWith('sat')) return 'saturday';
        if (item.startsWith('sun')) return 'sunday';
        return item;
      });
  }

  isSelectedDateValid(): boolean {
    if (!this.selectedService || !this.selectedDate) return false;

    if (this.selectedService.schedule_date) {
      return this.selectedDate === this.selectedService.schedule_date;
    }

    const allowedDays = this.normalizeAvailableDays(
      this.selectedService.available_days
    );
    const date = new Date(this.selectedDate);
    const selectedDay = date
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();

    return allowedDays.includes(selectedDay);
  }

  get dateValidationMessage(): string {
    if (!this.selectedService || !this.selectedDate) return '';

    if (this.isSelectedDateValid()) return '';

    if (this.selectedService.schedule_date) {
      return `This service is only available on ${this.selectedService.schedule_date}.`;
    }

    return `Selected date does not match ${this.selectedService.service_name}'s available days: ${this.selectedService.available_days}.`;
  }

  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  get availableTimeOptions(): ServiceAvailabilitySlot[] {
    return this.availableSlots.filter((slot) => slot.available);
  }

  bookAppointment(): void {
    this.bookingMessage = '';
    this.errorMessage = '';

    if (!this.selectedService || !this.selectedDate || !this.selectedTime) {
      this.errorMessage =
        'Please select a service, booking date, and time.';
      return;
    }

    if (!this.isSelectedDateValid()) {
      this.errorMessage = this.dateValidationMessage;
      return;
    }

    const chosenSlot = this.availableSlots.find(
      (slot) => slot.time === this.selectedTime && slot.available
    );

    if (!chosenSlot) {
      this.errorMessage = 'Selected time slot is no longer available.';
      return;
    }

    this.isSubmitting = true;

    this.apiBookingService
      .createBooking({
        serviceId: this.selectedService.id,
        bookingDate: this.selectedDate,
        bookingTime: this.selectedTime,
        notes: this.notes
      })
      .subscribe({
        next: () => {
          this.bookingMessage = 'Appointment booked successfully.';
          this.notificationMessage =
            'Your booking was submitted. Please monitor the booking status below.';
          this.selectedDate = '';
          this.selectedTime = '';
          this.notes = '';
          this.availableSlots = [];
          this.isSubmitting = false;
          this.loadBookings();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Booking failed.';
          this.notificationMessage =
            'Booking could not be completed. Please review your selected schedule.';
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