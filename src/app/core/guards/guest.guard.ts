import { inject, PLATFORM_ID } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const guestGuard: CanMatchFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('epila_token');
  const role = localStorage.getItem('epila_role');

  if (!token) {
    return true;
  }

  if (role === 'admin') {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return router.createUrlTree(['/patient/profile']);
};