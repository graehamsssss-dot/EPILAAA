import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor],
  templateUrl: './patient-layout.component.html',
  styleUrl: './patient-layout.component.css'
})
export class PatientLayoutComponent {
  constructor(private router: Router) {}

  patientNavItems = [
    { label: 'Profile', path: '/patient/profile' },
    { label: 'Booking', path: '/patient/booking' },
    { label: 'History', path: '/patient/history' },
    { label: 'Settings', path: '/patient/settings' }
  ];

  logout(): void {
    localStorage.removeItem('epila_token');
    localStorage.removeItem('epila_role');
    this.router.navigate(['/login']);
  }
}