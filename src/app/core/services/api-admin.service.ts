import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ApiResponse } from '../models/auth.models';
import {
  DashboardAnalytics,
  DashboardSummary,
  InventoryItem,
  InventoryLogItem,
  MonthlyReportItem,
  QueueItem
} from '../models/admin.models';
import { ServiceItem } from '../models/service.models';

@Injectable({
  providedIn: 'root'
})
export class ApiAdminService {
  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<ApiResponse<DashboardSummary>> {
    return this.http.get<ApiResponse<DashboardSummary>>(
      `${API_BASE_URL}/dashboard/summary`
    );
  }

  getDashboardAnalytics(range?: string): Observable<ApiResponse<DashboardAnalytics>> {
    const params = new URLSearchParams();

    if (range) params.set('range', range);

    const query = params.toString();
    const url = query
      ? `${API_BASE_URL}/dashboard/analytics?${query}`
      : `${API_BASE_URL}/dashboard/analytics`;

    return this.http.get<ApiResponse<DashboardAnalytics>>(url);
  }

  getServices(): Observable<ApiResponse<ServiceItem[]>> {
    return this.http.get<ApiResponse<ServiceItem[]>>(
      `${API_BASE_URL}/services`
    );
  }

  createService(payload: {
    serviceName: string;
    category: string;
    description: string;
    availableDays: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    slotLimit: number;
    status: string;
    linkedInventoryItems: string;
  }): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(
      `${API_BASE_URL}/services`,
      payload
    );
  }

  updateService(id: number, payload: {
    serviceName: string;
    category: string;
    description: string;
    availableDays: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    slotLimit: number;
    status: string;
    linkedInventoryItems: string;
  }): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${API_BASE_URL}/services/${id}`,
      payload
    );
  }

  deleteService(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${API_BASE_URL}/services/${id}`
    );
  }

  getQueue(date?: string, service?: string): Observable<ApiResponse<QueueItem[]>> {
    const params = new URLSearchParams();

    if (date) params.set('date', date);
    if (service) params.set('service', service);

    const query = params.toString();
    const url = query
      ? `${API_BASE_URL}/queue?${query}`
      : `${API_BASE_URL}/queue`;

    return this.http.get<ApiResponse<QueueItem[]>>(url);
  }

  updateQueueStatus(id: number, status: string): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${API_BASE_URL}/queue/${id}/status`,
      { status }
    );
  }

  getInventory(): Observable<ApiResponse<InventoryItem[]>> {
    return this.http.get<ApiResponse<InventoryItem[]>>(
      `${API_BASE_URL}/inventory`
    );
  }

  getInventoryLogs(): Observable<ApiResponse<InventoryLogItem[]>> {
    return this.http.get<ApiResponse<InventoryLogItem[]>>(
      `${API_BASE_URL}/inventory/logs`
    );
  }

  createInventoryItem(payload: {
    itemName: string;
    linkedService: string;
    currentStock: number;
    lowStockThreshold: number;
  }): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(
      `${API_BASE_URL}/inventory`,
      payload
    );
  }

  updateInventoryItem(id: number, payload: {
    itemName: string;
    linkedService: string;
    currentStock: number;
    lowStockThreshold: number;
  }): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${API_BASE_URL}/inventory/${id}`,
      payload
    );
  }

  restockInventoryItem(id: number, quantity: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${API_BASE_URL}/inventory/${id}/restock`,
      { quantity }
    );
  }

  archiveInventoryItem(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${API_BASE_URL}/inventory/${id}/archive`,
      {}
    );
  }

  getReports(): Observable<ApiResponse<MonthlyReportItem[]>> {
    return this.http.get<ApiResponse<MonthlyReportItem[]>>(
      `${API_BASE_URL}/reports`
    );
  }
}