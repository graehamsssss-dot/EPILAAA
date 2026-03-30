import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import {
  ApiResponse,
  LoginData,
  LoginPayload,
  RegisterData,
  RegisterPayload
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {
  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<ApiResponse<LoginData>> {
    return this.http.post<ApiResponse<LoginData>>(
      `${API_BASE_URL}/auth/login`,
      payload
    );
  }

  register(payload: RegisterPayload): Observable<ApiResponse<RegisterData>> {
    return this.http.post<ApiResponse<RegisterData>>(
      `${API_BASE_URL}/auth/register`,
      payload
    );
  }

  me(): Observable<ApiResponse<{ user: any }>> {
    return this.http.get<ApiResponse<{ user: any }>>(
      `${API_BASE_URL}/auth/me`
    );
  }
  
  
  

}