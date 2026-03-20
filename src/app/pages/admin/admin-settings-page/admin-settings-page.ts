import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings-page.html',
  styleUrl: './admin-settings-page.css'
})
export class AdminSettingsPage {
  profile = {
    fullName: 'Admin User',
    email: 'admin@epila.local',
    notifications: true,
    privacyMode: false
  };
}