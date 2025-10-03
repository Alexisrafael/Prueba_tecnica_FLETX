import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = async (): Promise<boolean> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const authenticated = await auth.isAuthenticated();
  if (!authenticated) {
    alert('⚠️ No tienes acceso. Por favor inicia sesión.');
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};

