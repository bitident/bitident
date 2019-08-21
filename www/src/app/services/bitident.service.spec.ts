import { TestBed } from '@angular/core/testing';

import { BitidentService } from './bitident.service';

describe('BitidentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BitidentService = TestBed.get(BitidentService);
    expect(service).toBeTruthy();
  });
});
