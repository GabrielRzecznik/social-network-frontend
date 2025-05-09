import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionService } from '../services/auth-session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(AuthSessionService);
  const router = inject(Router);
  const currentUser = sessionService.getCurrentUser();

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};




