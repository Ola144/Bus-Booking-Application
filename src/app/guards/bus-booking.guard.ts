import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MasterService } from '../service/master.service';

export const busBookingCanActivateGuard: CanActivateFn = (route, state) => {
  const masterService = inject(MasterService);
  const router = inject(Router);

  if (masterService.isLoggedIn()) {
    return true;
  } else {
    router.navigateByUrl('/account');
    return false;
  }
};
