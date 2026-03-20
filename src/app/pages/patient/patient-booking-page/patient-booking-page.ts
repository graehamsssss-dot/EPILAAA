import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-booking-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-booking-page.html',
  styleUrl: './patient-booking-page.css'
})
export class PatientBookingPage {
  services = [
    { name: 'Vaccination', description: 'Routine and seasonal vaccines', slots: '15 slots left' },
    { name: 'Dental Care', description: 'Basic oral examination and treatment', slots: '8 slots left' },
    { name: 'General Check Up', description: 'Consultation and vital signs check', slots: '20 slots left' }
  ];

  bookings = [
    { service: 'Vaccination', date: 'March 25, 2026', time: '9:00 AM', status: 'Confirmed' },
    { service: 'General Check Up', date: 'March 28, 2026', time: '10:00 AM', status: 'Pending' }
  ];
}