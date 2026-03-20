import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgFor],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Services', path: '/admin/services' },
    { label: 'Queue', path: '/admin/queue' },
    { label: 'Inventory', path: '/admin/inventory' },
    { label: 'Reports', path: '/admin/reports' },
    { label: 'Settings', path: '/admin/settings' }
  ];

  logout(): void {
    localStorage.removeItem('epila_token');
    localStorage.removeItem('epila_role');
    window.location.href = '/login';
  }
}