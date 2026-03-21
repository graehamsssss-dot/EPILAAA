import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [NgFor, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Services', path: '/admin/services' },
    { label: 'Queue', path: '/admin/queue' },
    { label: 'Inventory', path: '/admin/inventory' },
    { label: 'Reports', path: '/admin/reports' },
    { label: 'Settings', path: '/admin/settings' }
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}