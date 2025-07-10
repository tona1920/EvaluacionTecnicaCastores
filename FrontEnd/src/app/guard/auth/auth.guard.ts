import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { combineLatest, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return combineLatest([authService.authStatus$, authService.userStatus$]).pipe(
    take(1),
    map(([isAuthenticated, estatus]) => {
      if (!isAuthenticated || estatus <= 0) {
        authService.logout();
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
