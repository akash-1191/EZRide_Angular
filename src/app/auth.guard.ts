
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {

  const token = sessionStorage.getItem('token');
   const role = sessionStorage.getItem('Role');
  const router = inject(Router);

  // Expected role from route data
  const expectedRole = route.data['expectedRole'];

 if (!token) {
  router.navigate(['/login'], { replaceUrl: true });
  return false;
}

if (expectedRole && expectedRole !== role) {
  router.navigate(['/login'], { replaceUrl: true });
  return false;
}
  return true;
};
