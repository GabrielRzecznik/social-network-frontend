import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthSessionService } from '../services/auth-session.service';
import { map } from 'rxjs';

export const guestGuard: CanMatchFn = () => {
  const authSessionService = inject(AuthSessionService);
  const router = inject(Router);

  return authSessionService.currentUser$.pipe(
    map(user => {
      if (user) {
        return router.createUrlTree(['/home']);
      }
      return true;
    })
  );
};
