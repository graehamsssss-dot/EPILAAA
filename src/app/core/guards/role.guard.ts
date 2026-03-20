import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';

export function roleGuard(expectedRole: 'admin' | 'patient'): CanMatchFn {
  return (_route, _segments: UrlSegment[]) => {
    const router = inject(Router);
    const role = localStorage.getItem('epila_role');

    if (role === expectedRole) {
      return true;
    }

    if (role === 'admin') {
      return router.createUrlTree(['/admin/dashboard']);
    }

    if (role === 'patient') {
      return router.createUrlTree(['/patient/profile']);
    }

    return router.createUrlTree(['/login']);
  };
}