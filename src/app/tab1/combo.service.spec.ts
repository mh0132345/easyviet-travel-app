import { TestBed } from '@angular/core/testing';

import { ComboService } from './combo.service';

describe('ComboService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComboService = TestBed.get(ComboService);
    expect(service).toBeTruthy();
  });
});
