import { TestBed } from '@angular/core/testing';

import { FavCombosService } from './fav-combos.service';

describe('FavCombosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavCombosService = TestBed.get(FavCombosService);
    expect(service).toBeTruthy();
  });
});
