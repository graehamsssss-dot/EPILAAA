import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiSettingsService } from '../../../core/services/api-settings.service';
import { ApiAuthService } from '../../../core/services/api-auth.service';
import { SettingItem } from '../../../core/models/settings.models';

@Component({
  selector: 'app-patient-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-settings-page.html',
  styleUrl: './patient-settings-page.css'
})
export class PatientSettingsPage implements OnInit {
  successMessage = '';
  errorMessage = '';
  isLoading = false;

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

  constructor(
    private apiSettingsService: ApiSettingsService,
    private apiAuthService: ApiAuthService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;

    this.apiSettingsService.getSettings().subscribe({
      next: (response) => {
        const settings = response.data || [];

        const privacy = settings.find(
          (item: SettingItem) => item.setting_key === 'privacy_settings'
        );
        const preferences = settings.find(
          (item: SettingItem) => item.setting_key === 'account_preferences'
        );

        if (privacy?.setting_value) {
          this.privacySettings = {
            ...this.privacySettings,
            ...privacy.setting_value
          };
        }

        if (preferences?.setting_value) {
          this.preferencesForm = {
            ...this.preferencesForm,
            ...preferences.setting_value
          };
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load settings.';
        this.isLoading = false;
      }
    });
  }

  savePrivacySettings(): void {
    this.clearMessages();

    this.apiSettingsService.saveSetting({
      settingKey: 'privacy_settings',
      settingValue: this.privacySettings
    }).subscribe({
      next: () => {
        this.successMessage = 'Privacy settings saved successfully.';
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to save privacy settings.';
      }
    });
  }

  savePreferences(): void {
    this.clearMessages();

    this.apiSettingsService.saveSetting({
      settingKey: 'account_preferences',
      settingValue: this.preferencesForm
    }).subscribe({
      next: () => {
        this.successMessage = 'Preferences updated successfully.';
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to save preferences.';
      }
    });
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

    this.apiAuthService.changePassword({
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword
    }).subscribe({
      next: () => {
        this.successMessage = 'Password updated successfully.';
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to update password.';
      }
    });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}