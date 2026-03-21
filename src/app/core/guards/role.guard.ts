import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export function roleGuard(expectedRole: UserRole): CanMatchFn {
  return (_route, _segments: UrlSegment[]) => {
    const router = inject(Router);
    const auth = inject(AuthService);

    if (auth.getRole() === expectedRole) {
      return true;
    }

    if (auth.isAdmin()) {
      return router.createUrlTree(['/admin/dashboard']);
    }

    if (auth.isPatient()) {
      return router.createUrlTree(['/patient/profile']);
    }

    return router.createUrlTree(['/login']);
  };
}