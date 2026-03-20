import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

import { LandingPage } from './pages/public/landing-page/landing-page';
import { LoginPage } from './pages/public/login-page/login-page';
import { SignupPage } from './pages/public/signup-page/signup-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    title: 'ePILA | Home'
  },
  {
    path: 'login',
    canMatch: [guestGuard],
    component: LoginPage,
    title: 'ePILA | Login'
  },
  {
    path: 'signup',
    canMatch: [guestGuard],
    component: SignupPage,
    title: 'ePILA | Sign Up'
  },

  {
    path: 'admin',
    canMatch: [authGuard, roleGuard('admin')],
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout.component').then(
        m => m.AdminLayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/admin-dashboard-page/admin-dashboard-page').then(
            m => m.AdminDashboardPage
          ),
        title: 'ePILA | Admin Dashboard'
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./pages/admin/admin-service-schedule-page/admin-service-schedule-page').then(
            m => m.AdminServiceSchedulePage
          ),
        title: 'ePILA | Service Schedule'
      },
      {
        path: 'queue',
        loadComponent: () =>
          import('./pages/admin/admin-patient-queue-page/admin-patient-queue-page').then(
            m => m.AdminPatientQueuePage
          ),
        title: 'ePILA | Patient Queue'
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./pages/admin/admin-inventory-page/admin-inventory-page').then(
            m => m.AdminInventoryPage
          ),
        title: 'ePILA | Inventory'
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/admin/admin-report-page/admin-report-page').then(
            m => m.AdminReportPage
          ),
        title: 'ePILA | Reports'
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/admin/admin-settings-page/admin-settings-page').then(
            m => m.AdminSettingsPage
          ),
        title: 'ePILA | Admin Settings'
      }
    ]
  },

  {
    path: 'patient',
    canMatch: [authGuard, roleGuard('patient')],
    loadComponent: () =>
      import('./layout/patient-layout/patient-layout.component').then(
        m => m.PatientLayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile'
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/patient/patient-profile-page/patient-profile-page').then(
            m => m.PatientProfilePage
          ),
        title: 'ePILA | My Profile'
      },
      {
        path: 'booking',
        loadComponent: () =>
          import('./pages/patient/patient-booking-page/patient-booking-page').then(
            m => m.PatientBookingPage
          ),
        title: 'ePILA | Booking'
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./pages/patient/patient-history-page/patient-history-page').then(
            m => m.PatientHistoryPage
          ),
        title: 'ePILA | History'
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/patient/patient-settings-page/patient-settings-page').then(
            m => m.PatientSettingsPage
          ),
        title: 'ePILA | Settings'
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];