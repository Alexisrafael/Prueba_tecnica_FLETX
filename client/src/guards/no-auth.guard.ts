import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const NoAuthGuard: CanActivateFn = async (): Promise<boolean> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const authenticated = await auth.isAuthenticated();
  if (authenticated) {
    router.navigateByUrl('/dashboard');
    return false;
  }
  return true;
};

