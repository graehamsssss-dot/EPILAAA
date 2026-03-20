import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-profile-page.html',
  styleUrl: './patient-profile-page.css'
})
export class PatientProfilePage {
  patient = {
    fullName: 'Juan Dela Cruz',
    patientId: 'EPILA-2026-0001',
    sex: 'Male',
    age: 24,
    contactNumber: '09123456789',
    barangay: 'San Isidro',
    bloodType: 'O+',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=EPILA-2026-0001'
  };
}