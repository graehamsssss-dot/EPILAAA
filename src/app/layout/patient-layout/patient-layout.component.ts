import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [NgFor, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './patient-layout.component.html',
  styleUrl: './patient-layout.component.css'
})
export class PatientLayoutComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  patientNavItems = [
    { label: 'Profile', path: '/patient/profile' },
    { label: 'Booking', path: '/patient/booking' },
    { label: 'History', path: '/patient/history' },
    { label: 'Settings', path: '/patient/settings' }
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}