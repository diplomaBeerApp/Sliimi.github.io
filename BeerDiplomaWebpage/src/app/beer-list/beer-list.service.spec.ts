import { TestBed } from '@angular/core/testing';

import { BeerListService } from './beer-list.service';

describe('BeerListService', () => {
  let service: BeerListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeerListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
