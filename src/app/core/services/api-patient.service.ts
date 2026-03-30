import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ApiResponse } from '../models/auth.models';
import { PatientProfile } from '../models/patient.models';

@Injectable({
  providedIn: 'root'
})
export class ApiPatientService {
  private cachedProfile: PatientProfile | null = null;

  constructor(private http: HttpClient) {}

  getProfile(forceRefresh = false): Observable<ApiResponse<PatientProfile>> {
    if (!forceRefresh && this.cachedProfile) {
      return of({
        success: true,
        message: 'Patient profile fetched from cache',
        data: this.cachedProfile
      });
    }

    return this.http
      .get<ApiResponse<PatientProfile>>(`${API_BASE_URL}/patient/profile`)
      .pipe(
        tap((response) => {
          this.cachedProfile = response.data;
        })
      );
  }

  updateProfile(payload: Partial<PatientProfile>): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${API_BASE_URL}/patient/profile`,
      payload
    );
  }

  setCachedProfile(profile: PatientProfile): void {
    this.cachedProfile = profile;
  }

  clearCache(): void {
    this.cachedProfile = null;
  }
}