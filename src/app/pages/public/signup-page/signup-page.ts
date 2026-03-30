import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiAuthService } from '../../../core/services/api-auth.service';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.css',
})
export class SignupPage {
  constructor(
    private router: Router,
    private authService: AuthService,
    private apiAuthService: ApiAuthService
  ) {}

  currentStep = 1;
  totalSteps = 5;
  submitted = false;
  generatedId = '';
  generatedQrCode = '';
  showModal = false;
  isSubmitting = false;
  submitError = '';

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
    civilStatus: '',
    contactNumber: '',
    email: '',
    barangay: '',
    purok: '',
    address: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyRelationship: '',
    philhealthId: '',
    bloodType: '',
    allergies: '',
    existingConditions: '',
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

  calculateAge() {
    if (!this.form.birthDate) return;

    const birthDate = new Date(this.form.birthDate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.form.age = age;
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!this.form.firstName && !!this.form.lastName && !!this.form.birthDate && !!this.form.sex;
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

    this.submitError = '';
    this.isSubmitting = true;

    const payload = {
      firstName: this.form.firstName,
      middleName: this.form.middleName || '',
      lastName: this.form.lastName,
      suffix: this.form.suffix || '',
      birthDate: this.form.birthDate,
      age: this.form.age,
      sex: this.form.sex,
      civilStatus: this.form.civilStatus || '',
      contactNumber: this.form.contactNumber,
      email: this.form.email || '',
      barangay: this.form.barangay,
      purok: this.form.purok || '',
      address: this.form.address || '',
      emergencyContactName: this.form.emergencyContactName,
      emergencyContactNumber: this.form.emergencyContactNumber,
      emergencyRelationship: this.form.emergencyRelationship || '',
      philhealthId: this.form.philhealthId || '',
      bloodType: this.form.bloodType || '',
      allergies: this.form.allergies || '',
      existingConditions: this.form.existingConditions || '',
      password: this.form.password
    };

    this.apiAuthService.register(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        const token = response?.data?.token;
        const role = response?.data?.role;
        const patientId = response?.data?.patientId;
        const qrCode = response?.data?.qrCode;

        if (!token || !role || !patientId) {
          this.submitError = 'Invalid server response.';
          return;
        }

        this.authService.login(token, role, patientId);
        this.generatedId = patientId;
        this.generatedQrCode = qrCode || patientId;
        this.submitted = true;
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError =
          error?.error?.message ||
          'Registration failed. Please try again.';
      }
    });
  }

  downloadQR() {
    const qrValue = this.generatedQrCode || this.generatedId;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrValue}`;

    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${this.generatedId}.png`;
    link.click();
  }
}