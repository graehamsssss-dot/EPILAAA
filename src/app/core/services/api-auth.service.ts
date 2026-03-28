import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {
  constructor(private http: HttpClient) {}

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/login`, payload);
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/auth/register`, payload);
  }

  me(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/auth/me`);
  }
}