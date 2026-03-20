import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css'
})
export class AdminDashboardPage {
  summaryCards = [
    { title: 'Patients in Queue', value: 18, note: 'Today' },
    { title: 'Low Stock Items', value: 6, note: 'Needs attention' },
    { title: 'Reports', value: 12, note: 'This month' },
    { title: 'Completed Today', value: 27, note: 'Consultations done' }
  ];

  todayQueue = [
    { patientName: 'Juan Dela Cruz', service: 'General Check Up', time: '08:30 AM', status: 'Waiting' },
    { patientName: 'Maria Santos', service: 'Vaccination', time: '09:00 AM', status: 'In Progress' },
    { patientName: 'Pedro Reyes', service: 'Dental Care', time: '09:30 AM', status: 'Completed' },
    { patientName: 'Ana Lopez', service: 'Laboratory Tests', time: '10:00 AM', status: 'Waiting' }
  ];

  lowStockItems = [
    { itemName: 'Syringe 5ml', stock: 8 },
    { itemName: 'Gloves', stock: 12 },
    { itemName: 'Alcohol', stock: 5 },
    { itemName: 'Cotton', stock: 9 }
  ];

  getStatusClass(status: string): string {
    const value = status.toLowerCase();

    if (value === 'completed') return 'status completed';
    if (value === 'in progress') return 'status in-progress';
    return 'status waiting';
  }
}