import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiPatientService } from '../../../core/services/api-patient.service';
import { PatientProfile } from '../../../core/models/patient.models';

@Component({
  selector: 'app-patient-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-profile-page.html',
  styleUrl: './patient-profile-page.css'
})
export class PatientProfilePage implements OnInit {
  patient: PatientProfile | null = null;
  isLoading = true;
  isRefreshing = false;
  errorMessage = '';

  constructor(private apiPatientService: ApiPatientService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(forceRefresh = false): void {
    if (forceRefresh) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }

    this.errorMessage = '';

    this.apiPatientService.getProfile(forceRefresh).subscribe({
      next: (response) => {
        this.patient = response.data;
        this.isLoading = false;
        this.isRefreshing = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load patient profile.';
        this.isLoading = false;
        this.isRefreshing = false;
      }
    });
  }

  refreshProfile(): void {
    this.loadProfile(true);
  }

  get fullName(): string {
    if (!this.patient) return '';

    return [
      this.patient.first_name,
      this.patient.middle_name,
      this.patient.last_name,
      this.patient.suffix
    ]
      .filter(Boolean)
      .join(' ');
  }

  get qrCodeUrl(): string {
    if (!this.patient?.qr_code) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${this.patient.qr_code}`;
  }
}