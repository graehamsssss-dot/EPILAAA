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
  settings = {
    email: 'juan@example.com',
    notifications: true,
    privacy: false
  };
}