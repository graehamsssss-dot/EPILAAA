import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ApiPatientService } from './api-patient.service';

export type UserRole = 'admin' | 'patient';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'epila_token';
  private readonly roleKey = 'epila_role';
  private readonly patientIdKey = 'epila_patient_id';

  constructor(
    private storage: StorageService,
    private apiPatientService: ApiPatientService
  ) {}

  login(token: string, role: UserRole, patientId?: string | null): void {
    this.storage.setItem(this.tokenKey, token);
    this.storage.setItem(this.roleKey, role);

    if (patientId) {
      this.storage.setItem(this.patientIdKey, patientId);
    } else {
      this.storage.removeItem(this.patientIdKey);
    }
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
    this.storage.removeItem(this.roleKey);
    this.storage.removeItem(this.patientIdKey);
    this.apiPatientService.clearCache();
  }

  getToken(): string | null {
    return this.storage.getItem(this.tokenKey);
  }

  getRole(): UserRole | null {
    const role = this.storage.getItem(this.roleKey);
    return role === 'admin' || role === 'patient' ? role : null;
  }

  getPatientId(): string | null {
    return this.storage.getItem(this.patientIdKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isPatient(): boolean {
    return this.getRole() === 'patient';
  }
}