import { TestBed } from '@angular/core/testing';

import { Activitylogservices } from './activitylogservices';

describe('Activitylogservices', () => {
  let service: Activitylogservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Activitylogservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
