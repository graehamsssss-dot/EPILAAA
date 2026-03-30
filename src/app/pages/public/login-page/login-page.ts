import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiAuthService } from '../../../core/services/api-auth.service';

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
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiAuthService: ApiAuthService
  ) {}

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

    this.isLoading = true;

    this.apiAuthService.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;

        const token = response?.data?.token;
        const role = response?.data?.role;
        const patientId = response?.data?.patientId ?? null;

        if (!token || !role) {
          this.errorMessage = 'Invalid server response.';
          return;
        }

        this.authService.login(token, role, patientId);

        if (role === 'admin') {
          this.router.navigateByUrl('/admin/dashboard');
        } else {
          this.router.navigateByUrl('/patient/profile');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error?.error?.message ||
          'Login failed. Please check your credentials.';
      }
    });
  }
}