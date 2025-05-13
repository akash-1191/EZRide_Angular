
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('Role')
  const router = inject(Router);
  
  // Expected role from route data
  const expectedRole = route.data['expectedRole'];

  if (token && role === expectedRole) {

    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
