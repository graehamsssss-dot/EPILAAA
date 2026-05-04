import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type ModalType = 'about' | 'contact' | 'privacy' | 'terms' | 'help' | null;

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage {
  isScrolled = false;
  activeModal: ModalType = null;
  currentYear = new Date().getFullYear();

  features = [
    {
      icon: 'calendar_month',
      title: 'Easy Appointment Booking',
      description:
        'Patients can quickly browse services, choose schedules, and reserve slots with fewer steps.'
    },
    {
      icon: 'queue',
      title: 'Real-Time Queue Monitoring',
      description:
        'Monitor patient flow and service status more efficiently for a smoother clinic experience.'
    },
    {
      icon: 'inventory_2',
      title: 'Inventory-Aware Services',
      description:
        'Track service-linked supplies and reduce missed appointments caused by low stock.'
    },
    {
      icon: 'bar_chart',
      title: 'Clinic Reports',
      description:
        'Generate health, queue, and consultation summaries to support better decision-making.'
    },
    {
      icon: 'shield',
      title: 'Secure Patient Records',
      description:
        'Patient information is organized in one place for easier access and safer handling.'
    },
    {
      icon: 'devices',
      title: 'Modern Responsive Access',
      description:
        'Use ePILA comfortably on desktop, tablet, and mobile with a consistent modern interface.'
    }
  ];

  servicesList = [
    { icon: 'vaccines', name: 'Vaccination' },
    { icon: 'medical_services', name: 'General Check Up' },
    { icon: 'dentistry', name: 'Dental Care' },
    { icon: 'pregnant_woman', name: 'Maternal Care' },
    { icon: 'biotech', name: 'Laboratory Tests' },
    { icon: 'pets', name: 'Anti-Rabies / Animal Related' },
    { icon: 'healing', name: 'STD Test' },
    { icon: 'local_hospital', name: 'Other Health Services' }
  ];

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (!el) return;

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  openModal(type: ModalType): void {
    this.activeModal = type;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.style.overflow = '';
  }
}