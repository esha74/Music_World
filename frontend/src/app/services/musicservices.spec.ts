import { TestBed } from '@angular/core/testing';

import { Musicservices } from './musicservices';

describe('Musicservices', () => {
  let service: Musicservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Musicservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
