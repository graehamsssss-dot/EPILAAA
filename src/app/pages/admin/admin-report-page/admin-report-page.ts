import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiAdminService } from '../../../core/services/api-admin.service';
import { MonthlyReportItem } from '../../../core/models/admin.models';

@Component({
  selector: 'app-admin-report-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-report-page.html',
  styleUrl: './admin-report-page.css'
})
export class AdminReportPage implements OnInit {
  reports: MonthlyReportItem[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private apiAdminService: ApiAdminService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;

    this.apiAdminService.getReports().subscribe({
      next: (response) => {
        this.reports = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Failed to load reports.';
        this.isLoading = false;
      }
    });
  }
}