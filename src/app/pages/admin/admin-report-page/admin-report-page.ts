import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReportCard {
  label: string;
  value: string | number;
  note: string;
}

interface ServiceUsageItem {
  service: string;
  count: number;
}

interface InventoryUsageItem {
  itemName: string;
  used: number;
}

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

  monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  yearOptions = [2024, 2025, 2026, 2027];

  reportCards: ReportCard[] = [
    { label: 'Patient Count', value: 320, note: 'Patients served this month' },
    { label: 'Service Count', value: 540, note: 'Completed services' },
    { label: 'Queue Completion Rate', value: '89%', note: 'Processed successfully' },
    { label: 'Low Stock Summary', value: '6 Items', note: 'Needs restocking' }
  ];

  mostUsedServices: ServiceUsageItem[] = [
    { service: 'Vaccination', count: 120 },
    { service: 'General Check Up', count: 95 },
    { service: 'Laboratory Tests', count: 82 },
    { service: 'Dental Care', count: 64 },
    { service: 'Maternal', count: 41 }
  ];

  inventoryUsage: InventoryUsageItem[] = [
    { itemName: 'Syringe 5ml', used: 110 },
    { itemName: 'Gloves', used: 160 },
    { itemName: 'Alcohol', used: 70 },
    { itemName: 'Cotton', used: 85 }
  ];

  monthlyTrendValues = [150, 175, 190, 220, 205, 240];

  getBarWidth(value: number, max = 150): number {
    return Math.max(10, Math.round((value / max) * 100));
  }
}