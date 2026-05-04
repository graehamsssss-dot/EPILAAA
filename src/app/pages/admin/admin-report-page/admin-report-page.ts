import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPreloadService } from '../../../core/services/admin-preload.service';
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
  isLoading = true;
  errorMessage = '';

  constructor(private adminPreloadService: AdminPreloadService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(forceRefresh = false): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminPreloadService.getReportsCached(forceRefresh).subscribe({
      next: (response) => {
        this.reports = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load reports.';
        this.isLoading = false;
      }
    });
  }

  refreshReports(): void {
    this.adminPreloadService.clearCache();
    this.loadReports(true);
  }

  getMonthYear(report: MonthlyReportItem): string {
    return `${report.report_month} ${report.report_year}`;
  }
}