import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ApiResponse } from '../models/auth.models';
import {
  ServiceAvailabilityData,
  ServiceItem
} from '../models/service.models';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  getServices(): Observable<ApiResponse<ServiceItem[]>> {
    return this.http.get<ApiResponse<ServiceItem[]>>(
      `${API_BASE_URL}/services`
    );
  }

  getServiceAvailability(
    serviceId: number,
    date: string
  ): Observable<ApiResponse<ServiceAvailabilityData>> {
    return this.http.get<ApiResponse<ServiceAvailabilityData>>(
      `${API_BASE_URL}/services/${serviceId}/availability?date=${encodeURIComponent(date)}`
    );
  }
}