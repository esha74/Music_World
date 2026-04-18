import { TestBed } from '@angular/core/testing';

import { Otpservices } from './otpservices';

describe('Otpservices', () => {
  let service: Otpservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Otpservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
