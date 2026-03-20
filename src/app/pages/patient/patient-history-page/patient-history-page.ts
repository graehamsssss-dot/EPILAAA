import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-history-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-history-page.html',
  styleUrl: './patient-history-page.css'
})
export class PatientHistoryPage {
  history = [
    { service: 'Dental Care', date: 'March 10, 2026', status: 'Completed' },
    { service: 'Vaccination', date: 'February 12, 2026', status: 'Completed' },
    { service: 'General Check Up', date: 'January 19, 2026', status: 'Completed' }
  ];
}