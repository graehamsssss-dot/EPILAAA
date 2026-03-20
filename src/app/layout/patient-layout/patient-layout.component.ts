import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor],
  templateUrl: './patient-layout.component.html',
  styleUrl: './patient-layout.component.css'
})
export class PatientLayoutComponent {
  patientNavItems = [
    { label: 'Profile', path: '/patient/profile' },
    { label: 'Booking', path: '/patient/booking' },
    { label: 'History', path: '/patient/history' },
    { label: 'Settings', path: '/patient/settings' }
  ];

  logout(): void {
    localStorage.removeItem('epila_token');
    localStorage.removeItem('epila_role');
    window.location.href = '/login';
  }
}