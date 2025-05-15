import { inject } from '@angular/core';
import { CanMatchFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthSessionService } from '../services/auth-session.service';

export const authGuard: CanMatchFn = (
  route,
  segments
): MaybeAsync<GuardResult> => {
  const authSessionService = inject(AuthSessionService);
  const router = inject(Router);
  
  return authSessionService.currentUser$.pipe(
    map(user => {
      if (user) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};
