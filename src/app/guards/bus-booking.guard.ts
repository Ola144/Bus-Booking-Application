import { inject } from '@angular/core';
import {
  ActivatedRoute,
  CanActivateFn,
  ResolveFn,
  Router,
} from '@angular/router';
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

export const resolveBookedBus: ResolveFn<any> = () => {
  const masterService = inject(MasterService);
  return masterService.getAllBookedBus();
};

export const resolveVendor: ResolveFn<any> = () => {
  const masterService = inject(MasterService);
  return masterService.getAllVendors();
};

export const resolveUsers: ResolveFn<any> = () => {
  const masterService = inject(MasterService);
  return masterService.getAllUser();
};

export const resolveLocation: ResolveFn<any> = () => {
  const masterService = inject(MasterService);
  return masterService.getAllLocation();
};
export const resolveBus: ResolveFn<any> = () => {
  const masterService = inject(MasterService);
  return masterService.getAllBus();
};
export const resolveSearchBus: ResolveFn<any> = () => {
  const masterService = inject(MasterService);
  const localData = localStorage.getItem('SearchBusResult');
  let localBus;
  if (localData != null) {
    localBus = JSON.parse(localData);
  }
  return masterService.getSearchBus(localBus.fromLocation, localBus.toLocation);
};
export const resolveScheduleBus: ResolveFn<any> = () => {
  const masterService = inject(MasterService);
  const localSId = localStorage.getItem('scheduleId');
  let localScheduleId;
  if (localSId != null) {
    localScheduleId = JSON.parse(localSId);
  }

  return masterService.getScheduleBus(localScheduleId);
};
