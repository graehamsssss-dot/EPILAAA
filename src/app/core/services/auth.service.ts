import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export type UserRole = 'admin' | 'patient';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'epila_token';
  private readonly roleKey = 'epila_role';

  constructor(private storage: StorageService) {}

  loginAs(role: UserRole): void {
    const token = role === 'admin' ? 'demo-admin-token' : 'demo-patient-token';
    this.storage.setItem(this.tokenKey, token);
    this.storage.setItem(this.roleKey, role);
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
    this.storage.removeItem(this.roleKey);
  }

  getToken(): string | null {
    return this.storage.getItem(this.tokenKey);
  }

  getRole(): UserRole | null {
    const role = this.storage.getItem(this.roleKey);
    if (role === 'admin' || role === 'patient') {
      return role;
    }
    return null;
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