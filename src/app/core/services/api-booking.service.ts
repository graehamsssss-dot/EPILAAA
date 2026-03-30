import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ApiResponse } from '../models/auth.models';
import { BookingItem, CreateBookingPayload } from '../models/booking.models';

@Injectable({
  providedIn: 'root'
})
export class ApiBookingService {
  constructor(private http: HttpClient) {}

  getMyBookings(): Observable<ApiResponse<BookingItem[]>> {
    return this.http.get<ApiResponse<BookingItem[]>>(
      `${API_BASE_URL}/bookings/my`
    );
  }

  createBooking(payload: CreateBookingPayload): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(
      `${API_BASE_URL}/bookings`,
      payload
    );
  }

  cancelBooking(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${API_BASE_URL}/bookings/${id}/cancel`,
      {}
    );
  }
}