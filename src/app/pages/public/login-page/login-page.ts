import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  email = '';
  password = '';
  acceptedTerms = false;
  errorMessage = '';

  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/']);
  }

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    if (!this.acceptedTerms) {
      this.errorMessage = 'You must accept the Terms of Use.';
      return;
    }

    if (this.email.toLowerCase().includes('admin')) {
      localStorage.setItem('epila_token', 'demo-admin-token');
      localStorage.setItem('epila_role', 'admin');
      this.router.navigateByUrl('/admin/dashboard');
      return;
    }

    localStorage.setItem('epila_token', 'demo-patient-token');
    localStorage.setItem('epila_role', 'patient');
    this.router.navigateByUrl('/patient/profile');
  }
}