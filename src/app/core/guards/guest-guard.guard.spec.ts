import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { guestGuardGuard } from './guest-guard.guard';

describe('guestGuardGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guestGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
