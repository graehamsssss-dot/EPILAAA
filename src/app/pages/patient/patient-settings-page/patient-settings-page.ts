import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-settings-page.html',
  styleUrl: './patient-settings-page.css'
})
export class PatientSettingsPage {
  successMessage = '';
  errorMessage = '';

  privacySettings = {
    profileVisible: true,
    bookingNotifications: true,
    emailUpdates: false
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  preferencesForm = {
    preferredLanguage: 'English',
    reminderMode: 'Email',
    darkMode: true
  };

  savePrivacySettings(): void {
    this.clearMessages();
    this.successMessage = 'Privacy settings saved successfully.';
  }

  savePreferences(): void {
    this.clearMessages();
    this.successMessage = 'Preferences updated successfully.';
  }

  updatePassword(): void {
    this.clearMessages();

    if (
      !this.passwordForm.currentPassword ||
      !this.passwordForm.newPassword ||
      !this.passwordForm.confirmPassword
    ) {
      this.errorMessage = 'Please complete all password fields.';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match.';
      return;
    }

    this.successMessage = 'Password updated successfully.';
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}