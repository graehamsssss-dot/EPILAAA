import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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

  constructor(
    private router: Router,
    private authService: AuthService
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

    if (this.email.toLowerCase().includes('admin')) {
      this.authService.loginAs('admin');
      this.router.navigateByUrl('/admin/dashboard');
      return;
    }

    this.authService.loginAs('patient');
    this.router.navigateByUrl('/patient/profile');
  }
}