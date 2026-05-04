import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ApiResponse } from '../models/auth.models';
import { CurrentUserProfile } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService {
  constructor(private http: HttpClient) {}

  getCurrentUserProfile(): Observable<ApiResponse<CurrentUserProfile>> {
    return this.http.get<ApiResponse<CurrentUserProfile>>(
      `${API_BASE_URL}/users/me/profile`
    );
  }

  updateAdminProfile(payload: {
    fullName: string;
    email: string;
    contactNumber: string;
  }): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${API_BASE_URL}/users/admin/profile`,
      payload
    );
  }
}