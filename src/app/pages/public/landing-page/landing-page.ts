import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  currentYear = new Date().getFullYear();
  activeModal: string | null = null;
  isScrolled = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  openModal(modal: string) {
    this.activeModal = modal;
  }

  closeModal() {
    this.activeModal = null;
  }

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = this.document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isScrolled = this.document.documentElement.scrollTop > 20;
  }

  features = [
    {
      icon: 'event',
      title: 'Easy Booking',
      description: 'Book clinic services quickly and conveniently online.',
    },
    {
      icon: 'schedule',
      title: 'Queue Monitoring',
      description: 'Track waiting times and patient queue progress in real time.',
    },
    {
      icon: 'health_and_safety',
      title: 'Quality Healthcare',
      description: 'Reliable services focused on better patient care.',
    },
  ];

  servicesList = [
    { name: 'Vaccination', icon: 'vaccines' },
    { name: 'Dental Care', icon: 'dentistry' },
    { name: 'Maternal Care', icon: 'child_care' },
    { name: 'STD Testing', icon: 'biotech' },
    { name: 'Animal Bites / Anti-Rabies', icon: 'pets' },
    { name: 'Laboratory Tests', icon: 'science' },
    { name: 'General Checkup', icon: 'medical_services' },
  ];
}