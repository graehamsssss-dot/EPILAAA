import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPreloadService } from '../../../core/services/admin-preload.service';
import {
  DashboardAnalytics,
  DashboardPoint,
  DashboardSummary,
  QueueItem
} from '../../../core/models/admin.models';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.css'
})
export class AdminDashboardPage implements OnInit {
  isLoading = true;
  errorMessage = '';

  summary: DashboardSummary | null = null;
  analytics: DashboardAnalytics | null = null;

  reminders: string[] = [];
  summaryCards: { title: string; value: number | string; note: string }[] = [];
  monthlyConsultationData: DashboardPoint[] = [];
  serviceDistribution: DashboardPoint[] = [];

  selectedRange = 'monthly';

  availableRanges = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
  ];

  constructor(private adminPreloadService: AdminPreloadService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(forceRefresh = false): void {
    this.isLoading = true;
    this.errorMessage = '';

    Promise.all([
      this.adminPreloadService.getDashboardSummaryCached(forceRefresh).toPromise(),
      this.adminPreloadService
        .getDashboardAnalyticsCached(this.selectedRange, forceRefresh)
        .toPromise()
    ])
      .then(([summaryRes, analyticsRes]) => {
        this.summary = summaryRes?.data || null;
        this.analytics = analyticsRes?.data || null;

        this.buildSummaryCards();
        this.buildAnalyticsView();

        this.isLoading = false;
      })
      .catch((error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load dashboard.';
        this.isLoading = false;
      });
  }

  applyFilters(): void {
    this.loadDashboard(true);
  }

  resetFilters(): void {
    this.selectedRange = 'monthly';
    this.loadDashboard(true);
  }

  refreshDashboard(): void {
    this.adminPreloadService.clearCache();
    this.loadDashboard(true);
  }

  buildSummaryCards(): void {
    if (!this.summary) {
      this.summaryCards = [];
      return;
    }

    this.summaryCards = [
      {
        title: 'Patients in Queue',
        value: this.summary.patientsInQueue,
        note: 'Current active queue'
      },
      {
        title: 'Low Stock Items',
        value: this.summary.lowStockItems,
        note: 'Need restocking'
      },
      {
        title: 'Completed Today',
        value: this.summary.completedToday,
        note: 'Finished consultations'
      }
    ];
  }

  buildAnalyticsView(): void {
    this.reminders = this.analytics?.reminders || [];
    this.monthlyConsultationData = this.analytics?.monthlyConsultations || [];
    this.serviceDistribution = this.analytics?.serviceDistribution || [];
  }

  get upcomingQueue(): QueueItem[] {
    return this.analytics?.upcomingQueue || [];
  }

  get linePoints(): string {
    const data = this.monthlyConsultationData.map((item) => item.value);
    if (!data.length) return '';

    const width = 100;
    const height = 100;
    const max = Math.max(...data, 1);

    return data
      .map((value, index) => {
        const x = data.length === 1 ? 50 : (index / (data.length - 1)) * width;
        const y = height - (value / max) * 80 - 10;
        return `${x},${y}`;
      })
      .join(' ');
  }

  get maxConsultationValue(): number {
    if (!this.monthlyConsultationData.length) return 0;
    return Math.max(...this.monthlyConsultationData.map((item) => item.value));
  }

  get totalServiceDistribution(): number {
    return this.serviceDistribution.reduce((sum, item) => sum + item.value, 0);
  }

  get pieStyle(): string {
    const total = this.serviceDistribution.reduce((sum, item) => sum + item.value, 0);

    if (!total) {
      return 'conic-gradient(#334155 0% 100%)';
    }

    let current = 0;
    const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];

    const stops = this.serviceDistribution.map((item, index) => {
      const start = (current / total) * 100;
      current += item.value;
      const end = (current / total) * 100;
      return `${colors[index % colors.length]} ${start}% ${end}%`;
    });

    return `conic-gradient(${stops.join(', ')})`;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  trackByLabel(index: number, item: DashboardPoint): string {
    return item.label;
  }

  trackByQueueId(index: number, item: QueueItem): number {
    return item.id;
  }

  trackByReminder(index: number, item: string): string {
    return `${index}-${item}`;
  }
}