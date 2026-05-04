import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiSettingsService } from '../../../core/services/api-settings.service';
import { ApiAuthService } from '../../../core/services/api-auth.service';
import { ApiUserService } from '../../../core/services/api-user.service';
import { SettingItem } from '../../../core/models/settings.models';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings-page.html',
  styleUrl: './admin-settings-page.css'
})
export class AdminSettingsPage implements OnInit {
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  profileForm = {
    fullName: '',
    email: '',
    contactNumber: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  preferences = {
    notifications: true,
    reportAlerts: true,
    queueAlerts: true,
    inventoryAlerts: true
  };

  constructor(
    private apiSettingsService: ApiSettingsService,
    private apiAuthService: ApiAuthService,
    private apiUserService: ApiUserService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;

    Promise.all([
      this.apiUserService.getCurrentUserProfile().toPromise(),
      this.apiSettingsService.getSettings().toPromise()
    ])
      .then(([profileResponse, settingsResponse]) => {
        const profile = profileResponse?.data;
        const settings = settingsResponse?.data || [];

        if (profile) {
          this.profileForm = {
            fullName: profile.fullName || '',
            email: profile.email || '',
            contactNumber: profile.contactNumber || ''
          };
        }

        const notifications = settings.find(
          (item: SettingItem) => item.setting_key === 'admin_notifications'
        );

        if (notifications?.setting_value) {
          this.preferences = {
            ...this.preferences,
            ...notifications.setting_value
          };
        }

        this.isLoading = false;
      })
      .catch((error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load admin settings.';
        this.isLoading = false;
      });
  }

  saveProfile(): void {
    this.clearMessages();

    this.apiUserService.updateAdminProfile(this.profileForm).subscribe({
      next: () => {
        this.successMessage = 'Admin profile updated successfully.';
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to save admin profile.';
      }
    });
  }

  savePreferences(): void {
    this.clearMessages();

    this.apiSettingsService.saveSetting({
      settingKey: 'admin_notifications',
      settingValue: this.preferences
    }).subscribe({
      next: () => {
        this.successMessage = 'Notification preferences saved.';
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