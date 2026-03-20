import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-report-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-report-page.html',
  styleUrl: './admin-report-page.css'
})
export class AdminReportPage {
  selectedMonth = 'March';
  selectedYear = 2026;

  reportCards = [
    { label: 'Patient Count', value: 320 },
    { label: 'Service Count', value: 540 },
    { label: 'Most Used Service', value: 'Vaccination' },
    { label: 'Low Stock Summary', value: '6 Items' }
  ];
}