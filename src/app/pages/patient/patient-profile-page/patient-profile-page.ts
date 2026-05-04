import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiPatientService } from '../../../core/services/api-patient.service';
import { PatientProfile } from '../../../core/models/patient.models';

@Component({
  selector: 'app-patient-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-profile-page.html',
  styleUrl: './patient-profile-page.css'
})
export class PatientProfilePage implements OnInit {
  patient: PatientProfile | null = null;
  isLoading = true;
  isRefreshing = false;
  isSaving = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';

  editForm = {
    contactNumber: '',
    email: '',
    barangay: '',
    purok: '',
    address: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyRelationship: '',
    philhealthId: '',
    bloodType: '',
    allergies: '',
    existingConditions: ''
  };

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
    this.successMessage = '';

    this.apiPatientService.getProfile(forceRefresh).subscribe({
      next: (response) => {
        this.patient = response.data;
        this.patchEditForm(response.data);
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

  patchEditForm(profile: PatientProfile): void {
    this.editForm = {
      contactNumber: profile.contact_number || '',
      email: profile.email || '',
      barangay: profile.barangay || '',
      purok: profile.purok || '',
      address: profile.address || '',
      emergencyContactName: profile.emergency_contact_name || '',
      emergencyContactNumber: profile.emergency_contact_number || '',
      emergencyRelationship: profile.emergency_relationship || '',
      philhealthId: profile.philhealth_id || '',
      bloodType: profile.blood_type || '',
      allergies: profile.allergies || '',
      existingConditions: profile.existing_conditions || ''
    };
  }

  refreshProfile(): void {
    this.loadProfile(true);
  }

  startEdit(): void {
    if (!this.patient) return;
    this.patchEditForm(this.patient);
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    if (!this.patient) return;
    this.patchEditForm(this.patient);
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.editForm.contactNumber.trim() ||
      !this.editForm.barangay.trim() ||
      !this.editForm.emergencyContactName.trim() ||
      !this.editForm.emergencyContactNumber.trim()
    ) {
      this.errorMessage = 'Please complete required editable fields.';
      return;
    }

    this.isSaving = true;

    this.apiPatientService.updateProfile(this.editForm).subscribe({
      next: () => {
        this.successMessage = 'Patient profile updated successfully.';
        this.isSaving = false;
        this.isEditing = false;
        this.loadProfile(true);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to update patient profile.';
        this.isSaving = false;
      }
    });
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