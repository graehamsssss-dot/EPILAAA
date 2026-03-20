import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-landing-page',
  imports: [CommonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
   currentYear = new Date().getFullYear();
  activeModal: string | null = null;
  isScrolled = false;

  constructor(private router: Router) {}

  // Navigation
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  // Modals
  openModal(modal: string) {
    this.activeModal = modal;
  }

  closeModal() {
    this.activeModal = null;
  }

  // Scroll effect
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  // Landing page features (use icon class names or text icons)
  features = [
    {
      icon: 'event',  // Can be Material Icon string or CSS class
      title: 'Easy Booking',
      description: 'Book clinic services quickly online.'
    },
    {
      icon: 'schedule',
      title: 'Queue Monitoring',
      description: 'Track waiting time and queue number.'
    },
    {
      icon: 'health_and_safety',
      title: 'Quality Healthcare',
      description: 'Reliable services for better health.'
    }
  ];

  // Services list (use icon class names or text icons)
  servicesList = [
    { name: 'Vaccination', icon: 'vaccines' },
    { name: 'Dental Care', icon: 'dentistry' },
    { name: 'Maternal Care', icon: 'child_care' },
    { name: 'STD Testing', icon: 'biotech' },
    { name: 'Animal Bites', icon: 'pets' },
    { name: 'Lab Tests', icon: 'science' },
    { name: 'General Checkup', icon: 'medical_services' }
  ];

}
