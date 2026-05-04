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

  updateProfile(payload: {
    contactNumber: string;
    email: string;
    barangay: string;
    purok: string;
    address: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    emergencyRelationship: string;
    philhealthId: string;
    bloodType: string;
    allergies: string;
    existingConditions: string;
  }): Observable<ApiResponse<null>> {
    return this.http
      .put<ApiResponse<null>>(`${API_BASE_URL}/patient/profile`, payload)
      .pipe(
        tap(() => {
          if (this.cachedProfile) {
            this.cachedProfile = {
              ...this.cachedProfile,
              contact_number: payload.contactNumber,
              email: payload.email || null,
              barangay: payload.barangay,
              purok: payload.purok || null,
              address: payload.address || null,
              emergency_contact_name: payload.emergencyContactName,
              emergency_contact_number: payload.emergencyContactNumber,
              emergency_relationship: payload.emergencyRelationship || null,
              philhealth_id: payload.philhealthId || null,
              blood_type: payload.bloodType || null,
              allergies: payload.allergies || null,
              existing_conditions: payload.existingConditions || null
            };
          }
        })
      );
  }

  setCachedProfile(profile: PatientProfile): void {
    this.cachedProfile = profile;
  }

  clearCache(): void {
    this.cachedProfile = null;
  }
}