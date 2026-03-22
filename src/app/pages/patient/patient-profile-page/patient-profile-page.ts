import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PatientProfile {
  patientId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthDate: string;
  age: number;
  sex: string;
  civilStatus: string;
  contactNumber: string;
  email: string;
  barangay: string;
  purok: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyRelationship: string;
  philhealthId: string;
  bloodType: string;
  allergies: string;
  existingConditions: string;
  qrCodeUrl: string;
}

@Component({
  selector: 'app-patient-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-profile-page.html',
  styleUrl: './patient-profile-page.css'
})
export class PatientProfilePage {
  patient: PatientProfile = {
    patientId: 'EPILA-2026-0001',
    firstName: 'Juan',
    middleName: 'Santos',
    lastName: 'Dela Cruz',
    suffix: '',
    birthDate: '2002-05-18',
    age: 23,
    sex: 'Male',
    civilStatus: 'Single',
    contactNumber: '09123456789',
    email: 'juan@example.com',
    barangay: 'San Isidro',
    purok: 'Purok 3',
    address: 'San Isidro, Tuguegarao City',
    emergencyContactName: 'Maria Dela Cruz',
    emergencyContactNumber: '09987654321',
    emergencyRelationship: 'Mother',
    philhealthId: 'PH-1234567890',
    bloodType: 'O+',
    allergies: 'Seafood',
    existingConditions: 'Asthma',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=EPILA-2026-0001'
  };

  get fullName(): string {
    return [
      this.patient.firstName,
      this.patient.middleName,
      this.patient.lastName,
      this.patient.suffix
    ]
      .filter(Boolean)
      .join(' ');
  }
}