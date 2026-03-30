import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiAdminService } from '../../../core/services/api-admin.service';
import { DashboardSummary } from '../../../core/models/admin.models';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css'
})
export class AdminDashboardPage implements OnInit {
  summary: DashboardSummary | null = null;
  isLoading = true;
  errorMessage = '';

  summaryCards: { title: string; value: number | string; note: string }[] = [];

  constructor(private apiAdminService: ApiAdminService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiAdminService.getDashboardSummary().subscribe({
      next: (response) => {
        this.summary = response.data;
        this.summaryCards = [
          { title: 'Patients in Queue', value: response.data.patientsInQueue, note: 'Current active queue' },
          { title: 'Low Stock Items', value: response.data.lowStockItems, note: 'Needs restocking' },
          { title: 'Reports', value: response.data.reports, note: 'Generated reports' },
          { title: 'Completed Today', value: response.data.completedToday, note: 'Finished consultations' }
        ];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load dashboard.';
        this.isLoading = false;
      }
    });
  }
}