import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const guestGuard: CanMatchFn = () => {
  const router = inject(Router);
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