import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AdminProfile {
  fullName: string;
  email: string;
  contactNumber: string;
  role: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PrivacySettings {
  profileVisibility: boolean;
  auditLogsVisible: boolean;
  sessionAlerts: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  queueAlerts: boolean;
  lowStockAlerts: boolean;
  monthlyReports: boolean;
}

interface SystemSettings {
  bookingEnabled: boolean;
  allowPatientCancellation: boolean;
  queueAutoRefresh: boolean;
  inventoryAutoDeduction: boolean;
}

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings-page.html',
  styleUrl: './admin-settings-page.css'
})
export class AdminSettingsPage {
  profile: AdminProfile = {
    fullName: 'Admin User',
    email: 'admin@epila.local',
    contactNumber: '09123456789',
    role: 'System Administrator'
  };

  passwordForm: PasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  privacy: PrivacySettings = {
    profileVisibility: true,
    auditLogsVisible: true,
    sessionAlerts: true
  };

  notifications: NotificationSettings = {
    emailNotifications: true,
    smsNotifications: false,
    queueAlerts: true,
    lowStockAlerts: true,
    monthlyReports: true
  };

  system: SystemSettings = {
    bookingEnabled: true,
    allowPatientCancellation: true,
    queueAutoRefresh: true,
    inventoryAutoDeduction: true
  };

  passwordMessage = '';

  saveProfile(): void {
    alert('Profile settings saved.');
  }

  savePassword(): void {
    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
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

  savePrivacy(): void {
    alert('Privacy settings saved.');
  }

  saveNotifications(): void {
    alert('Notification preferences saved.');
  }

  saveSystemSettings(): void {
    alert('System settings saved.');
  }
}