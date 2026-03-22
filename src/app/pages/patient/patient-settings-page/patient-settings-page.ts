import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PrivacySettings {
  profileVisibility: boolean;
  showMedicalInfo: boolean;
  allowContactNotifications: boolean;
}

interface AccountPreferences {
  preferredLanguage: string;
  darkMode: boolean;
  receiveAppointmentReminders: boolean;
  receiveQueueUpdates: boolean;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-patient-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-settings-page.html',
  styleUrl: './patient-settings-page.css'
})
export class PatientSettingsPage {
  privacy: PrivacySettings = {
    profileVisibility: true,
    showMedicalInfo: true,
    allowContactNotifications: true
  };

  preferences: AccountPreferences = {
    preferredLanguage: 'English',
    darkMode: false,
    receiveAppointmentReminders: true,
    receiveQueueUpdates: true
  };

  passwordForm: PasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  passwordMessage = '';

  languageOptions = ['English', 'Filipino'];

  savePrivacy(): void {
    alert('Privacy settings saved.');
  }

  savePreferences(): void {
    alert('Account preferences saved.');
  }

  updatePassword(): void {
    if (
      !this.passwordForm.currentPassword ||
      !this.passwordForm.newPassword ||
      !this.passwordForm.confirmPassword
    ) {
      this.passwordMessage = 'Please fill in all password fields.';
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.passwordMessage = 'New password and confirm password do not match.';
      return;
    }

    this.passwordMessage = 'Password updated successfully.';
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }
}