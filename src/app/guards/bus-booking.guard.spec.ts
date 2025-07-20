import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { busBookingGuard } from './bus-booking.guard';

describe('busBookingGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => busBookingGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
