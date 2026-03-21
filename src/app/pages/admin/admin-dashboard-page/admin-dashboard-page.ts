import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SummaryCard {
  title: string;
  value: number | string;
  note: string;
}

interface QueuePreview {
  patientName: string;
  service: string;
  time: string;
  status: 'Waiting' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
}

interface InventoryAlert {
  itemName: string;
  linkedService: string;
  stock: number;
}

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css'
})
export class AdminDashboardPage {
  summaryCards: SummaryCard[] = [
    { title: 'Patients in Queue', value: 18, note: 'Current active queue' },
    { title: 'Low Stock Items', value: 6, note: 'Needs restocking' },
    { title: 'Reports', value: 12, note: 'Generated this month' },
    { title: 'Completed Today', value: 27, note: 'Finished consultations' }
  ];

  dailyPatientCount = [45, 58, 50, 72, 60, 80, 64];
  weeklyBookings = [20, 25, 18, 30, 27, 32, 29];
  serviceUsage = [
    { label: 'Vaccination', value: 85 },
    { label: 'Dental', value: 54 },
    { label: 'Maternal', value: 42 },
    { label: 'Lab Tests', value: 67 }
  ];
  monthlyTrends = [140, 180, 170, 220, 210, 245];

  queuePreview: QueuePreview[] = [
    { patientName: 'Juan Dela Cruz', service: 'General Check Up', time: '08:30 AM', status: 'Waiting' },
    { patientName: 'Maria Santos', service: 'Vaccination', time: '09:00 AM', status: 'In Progress' },
    { patientName: 'Pedro Reyes', service: 'Dental Care', time: '09:30 AM', status: 'Completed' },
    { patientName: 'Ana Lopez', service: 'Laboratory Tests', time: '10:00 AM', status: 'Waiting' }
  ];

  inventoryAlerts: InventoryAlert[] = [
    { itemName: 'Syringe 5ml', linkedService: 'Vaccination', stock: 8 },
    { itemName: 'Gloves', linkedService: 'General Check Up', stock: 12 },
    { itemName: 'Alcohol', linkedService: 'Laboratory Tests', stock: 5 },
    { itemName: 'Cotton', linkedService: 'Dental Care', stock: 9 }
  ];

  getStatusClass(status: string): string {
    const value = status.toLowerCase().replace(/\s+/g, '-');
    return `status ${value}`;
  }

  getBarHeight(value: number, max = 100): string {
    const percent = Math.max(20, Math.round((value / max) * 100));
    return `${percent}%`;
  }
}