import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, shareReplay, tap } from 'rxjs';
import { ApiAdminService } from './api-admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminPreloadService {
  private dashboardSummaryCache$: Observable<any> | null = null;
  private dashboardAnalyticsCache$: Observable<any> | null = null;
  private servicesCache$: Observable<any> | null = null;
  private reportsCache$: Observable<any> | null = null;

  constructor(private apiAdminService: ApiAdminService) {}

  preloadAdminData(): Observable<any> {
    return forkJoin({
      summary: this.getDashboardSummaryCached(),
      analytics: this.getDashboardAnalyticsCached('monthly'),
      services: this.getServicesCached(),
      reports: this.getReportsCached()
    });
  }

  getDashboardSummaryCached(forceRefresh = false): Observable<any> {
    if (!this.dashboardSummaryCache$ || forceRefresh) {
      this.dashboardSummaryCache$ = this.apiAdminService
        .getDashboardSummary()
        .pipe(shareReplay(1));
    }
    return this.dashboardSummaryCache$;
  }

  getDashboardAnalyticsCached(range = 'monthly', forceRefresh = false): Observable<any> {
    if (!this.dashboardAnalyticsCache$ || forceRefresh) {
      this.dashboardAnalyticsCache$ = this.apiAdminService
        .getDashboardAnalytics(range)
        .pipe(shareReplay(1));
    }
    return this.dashboardAnalyticsCache$;
  }

  getServicesCached(forceRefresh = false): Observable<any> {
    if (!this.servicesCache$ || forceRefresh) {
      this.servicesCache$ = this.apiAdminService
        .getServices()
        .pipe(shareReplay(1));
    }
    return this.servicesCache$;
  }

  getReportsCached(forceRefresh = false): Observable<any> {
    if (!this.reportsCache$ || forceRefresh) {
      this.reportsCache$ = this.apiAdminService
        .getReports()
        .pipe(shareReplay(1));
    }
    return this.reportsCache$;
  }

  clearCache(): void {
    this.dashboardSummaryCache$ = null;
    this.dashboardAnalyticsCache$ = null;
    this.servicesCache$ = null;
    this.reportsCache$ = null;
  }
}