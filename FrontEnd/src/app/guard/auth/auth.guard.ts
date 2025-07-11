import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { combineLatest, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService); 
  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  const userRole = authService.getUserRol(); 
  
  return combineLatest([authService.authStatus$, authService.userStatus$]).pipe(
    take(1),
    map(([isAuthenticated, estatus]) => {
      if (!isAuthenticated || estatus <= 0) {
        authService.logout();
        router.navigate(['/login']);
        return false;
      }

      if (allowedRoles && !allowedRoles.includes(userRole || '')) {
        router.navigate(['/acceso-denegado']);
        return false;
      }
      return true;
    })
  );
};
