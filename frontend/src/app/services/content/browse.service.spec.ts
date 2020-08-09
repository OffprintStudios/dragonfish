import { TestBed } from '@angular/core/testing';

import { BrowseService } from './browse.service';

describe('BrowseService', () => {
  let service: BrowseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
