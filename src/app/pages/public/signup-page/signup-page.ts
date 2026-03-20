import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.css',
})
export class SignupPage {
  constructor(private router: Router) {}

  currentStep = 1;
  totalSteps = 5;
  submitted = false;
  generatedId = '';
  showModal = false;

  showPassword = false;
  showConfirmPassword = false;

  form: any = {
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthDate: '',
    age: null,
    sex: '',
    contactNumber: '',
    email: '',
    barangay: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    philhealthId: '',
    bloodType: '',
    allergies: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  sexOptions = ['Male', 'Female', 'Other'];
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  goToHome() {
    this.router.navigate(['/']);
  }

  goToPatientPortal() {
    localStorage.setItem('epila_token', 'demo-patient-token');
    localStorage.setItem('epila_role', 'patient');
    this.router.navigate(['/patient/profile']);
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!this.form.firstName && !!this.form.lastName && !!this.form.sex;
      case 2:
        return !!this.form.contactNumber && !!this.form.barangay;
      case 3:
        return !!this.form.emergencyContactName && !!this.form.emergencyContactNumber;
      case 4:
        return true;
      case 5:
        return !!this.form.password &&
          !!this.form.confirmPassword &&
          this.form.password === this.form.confirmPassword &&
          this.form.acceptTerms;
      default:
        return false;
    }
  }

  calculateAge() {
    if (!this.form.birthDate) return;

    const birthDate = new Date(this.form.birthDate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.form.age = age;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  openTerms(event: Event) {
    event.preventDefault();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  acceptTerms() {
    this.form.acceptTerms = true;
    this.closeModal();
  }

  submitRegistration() {
    if (!this.canProceed()) return;

    this.generatedId = 'EPILA-' + Math.floor(100000 + Math.random() * 900000);
    this.submitted = true;

    localStorage.setItem('epila_token', 'demo-patient-token');
    localStorage.setItem('epila_role', 'patient');
  }

  downloadQR() {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${this.generatedId}`;

    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${this.generatedId}.png`;
    link.click();
  }
}