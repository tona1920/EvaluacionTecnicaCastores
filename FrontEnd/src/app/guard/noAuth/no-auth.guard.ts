import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { map, take, tap } from 'rxjs';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

   return authService.authStatus$.pipe(
    take(1),
    tap((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigateByUrl( '/home');
      }
    }),
    map(isAuthenticated => !isAuthenticated)
    );
};
