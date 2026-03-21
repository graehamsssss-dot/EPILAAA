import { inject, PLATFORM_ID } from '@angular/core';
import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export function roleGuard(expectedRole: 'admin' | 'patient'): CanMatchFn {
  return (_route, _segments: UrlSegment[]) => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
      return true;
    }

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